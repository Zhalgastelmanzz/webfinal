const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.register = async (req, res) => {
  try {
   
    console.log('Полученные данные для регистрации:', req.body);

    const { fullName, email, password, phone, defaultAddress } = req.body;

   
    if (!fullName || fullName.trim() === '') {
      return res.status(400).json({ message: 'Full Name обязательно' });
    }

    if (!email || !password) {
      return res.status(400).json({ message: 'Email и Password обязательны' });
    }

    
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

  
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

   
    user = new User({
      fullName: fullName.trim(),
      email: email.trim(),
      passwordHash,
      phone: phone ? phone.trim() : undefined,
      defaultAddress: defaultAddress || undefined
    });

  
    await user.save();

    console.log(`Пользователь успешно создан: ${user.email}`);

    res.status(201).json({ 
      message: 'Регистрация успешна! Теперь войдите в аккаунт',
      userId: user._id 
    });

  } catch (error) {
   
    console.error('Ошибка при регистрации:', error.message);
    console.error(error.stack); 

    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Ошибка валидации данных', 
        details: error.message 
      });
    }

    res.status(500).json({ 
      message: 'Внутренняя ошибка сервера', 
      error: error.message 
    });
  }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};