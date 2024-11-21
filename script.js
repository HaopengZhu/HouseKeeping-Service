// script.js
// 切换到第二步的函数

//初始化
localStorage.setItem("loginCount","0");
localStorage.setItem("houseKeepingCount","0");
localStorage.removeItem("userId")
function goToStep2() {
    console.log("goToStep2 function triggered");
    document.getElementById("step1").style.display = "none"; // 隐藏第一步
    document.getElementById("step2").style.display = "block"; // 显示第二步
}

document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("loginBtn");
    const employeeLoginBtn = document.getElementById("employeeLoginBtn");
    const addressInfo = document.getElementById("addressInfo");
    const registerBtn = document.getElementById("registerBtn");
    const bookServiceBtn = document.getElementById("bookServiceBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    const myInfoBtn = document.getElementById("myInfoBtn");
    const myBookingBtn = document.getElementById("myBookingBtn");

    const loginModal = document.getElementById("loginModal");
    const registerModal = document.getElementById("registerModal");
    const bookingModal = document.getElementById("bookingModal");
    const infoModal = document.getElementById("infoModal");
    const bookingInfoModal = document.getElementById("bookingInfoModal");

    const closeModalBtn = document.getElementById("closeModalBtn");
    const bookingForm = document.getElementById("bookingForm");
    const closeLoginModal = document.getElementById("closeLoginModal");
    const closeRegisterModal = document.getElementById("closeRegisterModal");
    const closeInfoModal = document.getElementById("closeInfoModal");
    const closeBookingInfoModal = document.getElementById("closeBookingInfoModal");
    const userBookingContent = document.getElementById("userBookingContent");
    const employeeBookingContent = document.getElementById("employeeBookingContent");
    const employeeAddressInfo = document.getElementById("employeeAddressInfo");
    const accessRestrictionMessage = document.getElementById("accessRestrictionMessage");
    const cancelBookingBtn = document.getElementById("cancelBookingBtn");

    let isEmployee = false;
    loginBtn.onclick = () => {
        isEmployee = false;
        loginSuccess();
    };

    employeeLoginBtn.onclick = () => {
        isEmployee = true;
        loginSuccess();
    };

    // Function after successful login
    function loginSuccess() {
        loginBtn.style.display = "none";
        employeeLoginBtn.style.display = "none";
        registerBtn.style.display = "none";
        logoutBtn.style.display = "inline-block";
        myInfoBtn.style.display = "inline-block";
        myBookingBtn.style.display = "inline-block";
        loginModal.style.display = "none";
        bookingInfoModal.style.display = "none";

        if (isEmployee) {
            addressInfo.style.display = "block";
            userBookingContent.style.display = "none";
            employeeBookingContent.style.display = "block";
            cancelBookingBtn.style.display = "inline-block";
            checkBookingAccess();
        } else {
            addressInfo.style.display = "none";
            userBookingContent.style.display = "block";
            employeeBookingContent.style.display = "none";
            cancelBookingBtn.style.display = "none";
        }
    }

    function checkBookingAccess() {
        const bookingDate = new Date(); // 模拟预约时间
        bookingDate.setDate(bookingDate.getDate() + 2); // 设置为2天后

        const currentDate = new Date();
        const timeDifference = (bookingDate - currentDate) / (1000 * 60 * 60 * 24); // 天数差

        if (timeDifference > 1) {
            accessRestrictionMessage.style.display = "block";
            employeeAddressInfo.style.display = "none";
        } else {
            accessRestrictionMessage.style.display = "none";
            employeeAddressInfo.style.display = "block";
        }
    }

    cancelBookingBtn.onclick = () => {
    const confirmCancel = confirm("Are you sure you want to cancel this booking?");
    if (confirmCancel) {
        const bookingId = localStorage.getItem("currentBookingId");  // 确保这里正确获取了预约ID
        fetch(`/api/cancelBooking/${bookingId}`, {
            method: 'DELETE'  // 使用 DELETE 方法
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Booking cancelled successfully, parties notified') {
                alert("Booking has been cancelled and parties notified.");
                bookingInfoModal.style.display = "none";
                // 这里可以添加代码来刷新页面或更新UI状态
            } else {
                alert("Failed to cancel booking: " + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to cancel booking due to an error.');
        });
    }
};

    // Click event of the exit button
    logoutBtn.onclick = () => {
        loginBtn.style.display = "inline-block";
        employeeLoginBtn.style.display = "inline-block";
        registerBtn.style.display = "inline-block";
        logoutBtn.style.display = "none";
        myInfoBtn.style.display = "none";
        myBookingBtn.style.display = "none";
        addressInfo.style.display = "none";
        document.getElementById("myInfoBtn").style.display = "none";
        document.getElementById("myBookingBtn").style.display = "none";
    };
    // 登录请求，成功后存储用户邮箱并显示在 My Info 弹窗中
    document.getElementById("loginForm").onsubmit = (e) => {
        e.preventDefault();
        let loginCount = Number(localStorage.getItem("loginCount"));
        if(loginCount == 3){
            alert("If you enter your password incorrectly three times, your account will be locked")
            return
        }
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email: email, password_hash: password})
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === "Login successful") {
                    localStorage.setItem("userEmail", data.email);  // 存储用户邮箱
                    localStorage.setItem("userId", data.userId);  // 存储用户id
                    document.getElementById("accountEmail").textContent = data.email;  // 更新 My Info 弹窗中的邮箱显示
                    document.getElementById("infoModal").style.display = "block";  // 显示 My Info 弹窗
                    loginSuccess();
                } else {
                    alert("Login failed!");
                    loginCount = loginCount + 1
                    localStorage.setItem("loginCount",String(loginCount))
                }
            })
            .catch(error => console.error("Error:", error));


    };

    //发送预约请求
    document.getElementById("reservation").onclick = ()=>{
        let houseKeepingCount = Number(localStorage.getItem("houseKeepingCount"));
        const date = document.getElementById("date").value
        const service = document.getElementById("service").value
        if(houseKeepingCount == 3){
            alert("It is not possible to make another appointment after three appointments")
            return
        }
        fetch("http://localhost:3000/booking", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({user_id:localStorage.getItem("userId"),booking_date: date, service_type: service})
        })
            .then(response => response.json())
            .then(data => {
                if(data.message === "Booking successful"){
                    alert("The appointment was successful")
                    houseKeepingCount++;
                    localStorage.setItem("houseKeepingCount",houseKeepingCount);
                    document.getElementById("step1").style.display = "none"; // 隐藏第一步
                    document.getElementById("step2").style.display = "none"; // 显示第二步
                    bookingModal.style.display = "none";
                }else{
                    alert("The appointment failed")
                }
            })
            .catch(error => console.error("Error:", error));
    }
    // Open the login pop-up window
    loginBtn.onclick = () => {
        loginModal.style.display = "block";
    };
    employeeLoginBtn.onclick = () => {
        loginModal.style.display = "block";
    };
    // Open the registration pop-up window
    registerBtn.onclick = () => {
        registerModal.style.display = "block";
    };

    // Close the login pop-up window
    closeLoginModal.onclick = () => {
        loginModal.style.display = "none";
    };

    // Open the "My Information" pop-up window
    myInfoBtn.onclick = () => {
        infoModal.style.display = "block";
    };

    // Open the "My Appointment" pop-up window
    myBookingBtn.onclick = () => {
        bookingInfoModal.style.display = "block";
    };

    // Close the "My Information" pop-up window
    closeInfoModal.onclick = () => {
        infoModal.style.display = "none";
    };

    // Close the "My Appointment" pop-up window
    closeBookingInfoModal.onclick = () => {
        bookingInfoModal.style.display = "none";
    };

    // Close the registration pop-up
    closeRegisterModal.onclick = () => {
        registerModal.style.display = "none";
    };
    // Open pop-up
    bookServiceBtn.onclick = () => {
        let userId = localStorage.getItem("userId");
        if (!userId) {
            alert("Please log in first！！！")
            return
        }
        document.getElementById("step1").style.display = "block"; // 隐藏第一步
        document.getElementById("step2").style.display = "none"; // 显示第二步


        bookingModal.style.display = "block";
    };

    // Close pop-up
    closeModalBtn.onclick = function () {
        document.getElementById("bookingModal").style.display = "none";
    };


    // Click outside the pop-up window to close it
    window.onclick = (event) => {
        if (event.target === bookingModal) {
            bookingModal.style.display = "none";
        }
        if (event.target === loginModal) {
            loginModal.style.display = "none";
        }
        if (event.target === registerModal) {
            registerModal.style.display = "none";
        }
        if (event.target === infoModal) {
            infoModal.style.display = "none";
        }
        if (event.target === bookingInfoModal) {
            bookingInfoModal.style.display = "none";
        }
    };

    // Form submission event, temperature verification
    bookingForm.onsubmit = (event) => {
        const temperature = parseFloat(document.getElementById("temperature").value);

        if (temperature < 35 || temperature > 38) {
            alert("If you are at risk of contracting COVID-19, we have the right to refuse your appointment.");
            event.preventDefault(); // Prevent form submission
        } else {
            alert("The appointment was successful, thank you for filling out the form!");
        }
    };
});

function fetchBookingDetails(bookingId) {
    const isEmployee = localStorage.getItem("isEmployee"); // 假设你存储了用户角色信息
    fetch(`/api/bookings/${bookingId}?isEmployee=${isEmployee}`)
    .then(response => response.json())
    .then(data => {
        displayBookingInfo(data); // 显示适当的信息
    })
    .catch(error => console.log('Error fetching booking details:', error));
}

function displayBookingInfo(data) {
    if (data.service_type) {
        // 显示完整信息或部分信息
        document.getElementById("bookingServiceType").textContent = data.service_type;
        document.getElementById("bookingDate").textContent = new Date(data.booking_date).toLocaleString();
        // 根据员工的权限调整是否显示更多信息
        document.getElementById("bookingStatus").textContent = data.status || '';
    } else {
        // 处理无数据或错误情况
        console.log('No booking details available.');
    }
}


document.getElementById("deleteAccountBtn").onclick = () => {
    alert("Account deleted successfully.");
    logoutBtn.onclick();
};

// 处理注册请求
document.getElementById("registerForm").onsubmit = function (event) {
    event.preventDefault(); // 防止表单默认提交
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    // 向后端发送注册请求
    fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email, password_hash: password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Registration successful") {
                alert("Registration successful!");
            } else if (data.error === "Invalid input: special characters are not allowed") {
                alert("Invalid input: special characters are not allowed!");
            } else {
                alert("Registration failed!");
            }
        })
        .catch(error => console.error("Error:", error));
};

// 删除账户功能
document.getElementById("deleteAccountBtn").onclick = function () {
    const email = localStorage.getItem("userEmail");

    // 检查邮箱是否存在
    if (!email) {
        alert("No user is currently logged in.");
        return;
    }

    fetch("http://localhost:3000/deleteAccount", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Account deleted successfully") {
                alert("Account deleted successfully.");
                localStorage.removeItem("userEmail"); // 清除 localStorage 中的邮箱
                document.getElementById("infoModal").style.display = "none"; // 关闭 My Info 弹窗
                document.getElementById("loginBtn").style.display = "inline-block";
                document.getElementById("logoutBtn").style.display = "none";
            } else {
                alert("Failed to delete account.");
            }
        })
        .catch(error => console.error("Error:", error));
};

// 处理预约请求
document.getElementById("bookingForm").onsubmit = function (event) {
    event.preventDefault(); // 防止表单默认提交
    const userId = localStorage.getItem("userId"); // 获取用户ID
    const serviceType = document.getElementById("service").value;
    const bookingDate = document.getElementById("date").value;

    // 检查用户是否登录
    if (!userId) {
        alert("Please log in before booking.");
        return;
    }

    // 向后端发送预约请求
    fetch("http://localhost:3000/booking", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ user_id: userId, service_type: serviceType, booking_date: bookingDate })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Booking successful") {
                alert("Booking successful!");
            } else {
                alert("Booking failed!");
            }
        })
        .catch(error => console.error("Error:", error));
};
