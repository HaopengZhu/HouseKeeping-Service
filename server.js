const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');  // 添加 crypto 模块

// 验证输入是否合法的函数
function isValidInput(input) {
    const regex = /^[a-zA-Z0-9@._-]+$/; // 允许的字符：字母、数字、@、.、_、-
    return regex.test(input);
}

const app = express();

app.use(bodyParser.json());

// 设置静态文件目录
app.use(express.static(path.join(__dirname, '/')));

// 创建数据库连接
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '114514',
    database: 'housekeeping'
});

db.connect((err) => {
    if (err) {
        console.error('Failed to connect to the database:', err);
        return;
    }
    console.log('Connected to the database successfully');
});

// 用户注册路由
app.post('/register', (req, res) => {
    const { email, password_hash } = req.body;

    // 检查输入是否合法
    if (!isValidInput(email) || !isValidInput(password_hash)) {
        res.status(400).json({ error: 'Invalid input: special characters are not allowed' });
        return;
    }

    // 使用 SHA-256 加密密码
    const hashedPassword = crypto.createHash('sha256').update(password_hash).digest('hex');

    const sql = 'INSERT INTO users (email, password_hash, is_logged_in) VALUES (?, ?, 0)';
    db.query(sql, [email, hashedPassword], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Registration failed' });
            return;
        }
        res.status(200).json({ message: 'Registration successful' });
    });
});


// 登录请求
app.post('/login', (req, res) => {
    const { email, password_hash } = req.body;

    // 检查输入是否合法
    if (!isValidInput(email) || !isValidInput(password_hash)) {
        res.status(400).json({ error: 'Invalid input: special characters are not allowed' });
        return;
    }

    // 使用 SHA-256 加密密码
    const hashedPassword = crypto.createHash('sha256').update(password_hash).digest('hex');

    const sql = 'SELECT * FROM users WHERE email = ? AND password_hash = ?';
    db.query(sql, [email, hashedPassword], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Login failed' });
            return;
        }

        if (results.length > 0) {
            res.status(200).json({ message: 'Login successful', email: email, userId: results[0].user_id });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    });
});


// 删除账户请求
app.post('/deleteAccount', (req, res) => {
    const { email } = req.body;
    const sql = 'DELETE FROM users WHERE email = ?';
    db.query(sql, [email], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Account deletion failed' });
            return;
        }

        res.status(200).json({ message: 'Account deleted successfully' });
    });
});

// 预约服务路由
app.post('/booking', (req, res) => {
    const { user_id, service_type, booking_date } = req.body;
    const sql = 'INSERT INTO booking (user_id, service_type, booking_date, statues) VALUES (?, ?, ?, "pending")';
    db.query(sql, [user_id, service_type, booking_date], (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json({ error: 'Booking failed' });
            return;
        }
        res.status(200).json({ message: 'Booking successful' });
    });
});

app.post('/api/cancelBooking/:bookingId', (req, res) => {
    const { bookingId } = req.params;

    // Step 1: Update the booking status in the database
    const sqlUpdate = 'UPDATE booking SET status = "cancelled" WHERE booking_id = ?';
    db.query(sqlUpdate, [bookingId], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Failed to cancel booking' });
            return;
        }
        
        // Step 2: Notify the customer and employee
        // Placeholder: Implement notification logic here (e.g., send email or push notification)
        notifyParties(bookingId); // This is a placeholder function call

        res.json({ message: 'Booking cancelled successfully, parties notified' });
    });
});

function notifyParties(bookingId) {
    // Placeholder function to handle notification logic
    console.log(`Notifying parties about cancellation of booking ${bookingId}`);
    // Actual implementation would involve looking up user details and sending notifications
}

app.get('/api/bookings/:bookingId', (req, res) => {
    const { bookingId } = req.params;
    const isEmployee = req.query.isEmployee; // 一个简单的例子，实际应用中可能需要更复杂的权限检查

    let sql = isEmployee ? 
        'SELECT booking_date, service_type, status FROM booking WHERE booking_id = ?' : 
        'SELECT * FROM booking WHERE booking_id = ?';

    db.query(sql, [bookingId], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Failed to retrieve booking information' });
            return;
        }
        res.json(results[0]);
    });
});



// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`The server is up：http://127.0.0.1:${PORT}`);
});

