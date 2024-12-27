/*!
 * Start Bootstrap - Agnecy Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top'
})

let isScrolling = false; // 用於控制是否正在滾動
let stepIndex = 0; // 當前步驟索引

// 設定 logo 移動的步驟，增大路徑幅度
const moveSteps = [
    { top: 'calc(50% + 5cm)', left: '50%', rotate: '0deg' },  // 初始位置
    { top: 'calc(40% + 6cm)', left: '40%', rotate: '45deg' }, // 向上左側移動
    { top: 'calc(20% + 5cm)', left: '20%', rotate: '90deg' }, // 向上右側移動
    { top: 'calc(10% + 8cm)', left: '10%', rotate: '135deg' }, // 向右下移動
    { top: 'calc(5% + 10cm)', left: '30%', rotate: '180deg' }, // 向右下繼續移動
    { top: '120vh', left: '120vw', rotate: '360deg' } // 最後離開畫面，向頁面外部移動
];

const logoContainer = document.querySelector('.logo-container');

// 滾動事件
window.addEventListener('wheel', function (e) {
    if (isScrolling) {
        // 如果正在滾動中，阻止頁面滾動
        e.preventDefault();
        return;
    }

    // 滾動邏輯
    if (stepIndex < moveSteps.length - 1) {
        // 根據滾動方向決定是否前進
        if (e.deltaY > 0 && stepIndex < moveSteps.length - 1) { // 向下滾動
            stepIndex++;
        } else if (e.deltaY < 0 && stepIndex > 0) { // 向上滾動
            stepIndex--;
        }

        // 更新 logo 位置
        logoContainer.style.top = moveSteps[stepIndex].top;
        logoContainer.style.left = moveSteps[stepIndex].left;
        logoContainer.style.transform = `translate(-50%, -50%) rotate(${moveSteps[stepIndex].rotate})`;

        // 如果 logo 完全離開畫面，允許頁面滾動
        if (stepIndex === moveSteps.length - 1 || stepIndex === 0) {
            isScrolling = true; // 開始允許滾動頁面
            setTimeout(() => {
                isScrolling = false; // 結束滾動，恢復頁面滾動
            }, 300); // 延遲時間
        }
    }

        // 當滾動回到頂部時，讓 logo 回到初始位置
    if (window.scrollY === 0 && stepIndex !== 0) {
        stepIndex = 0; // 返回初始位置
        logoContainer.style.top = moveSteps[stepIndex].top;
        logoContainer.style.left = moveSteps[stepIndex].left;
        logoContainer.style.transform = `translate(-50%, -50%) rotate(${moveSteps[stepIndex].rotate})`;

        // 如果 logo 被隱藏，將其顯示
        if (logoContainer.style.display === 'none' || logoContainer.style.display === '') {
            logoContainer.style.display = 'block'; // 顯示 logo
        }
    }
});


window.addEventListener('scroll', function() {
    const images = document.querySelectorAll('.scroll-image');  // 取得所有需要滾動顯示的圖片
    const windowHeight = window.innerHeight;  // 視窗高度
    const scrollPosition = window.scrollY;  // 頁面滾動的距離
    const offset = 150;  // 提前顯示的距離，數值越小圖片越早顯示

    images.forEach(image => {
        const imageTop = image.getBoundingClientRect().top + scrollPosition;  // 圖片距離頁面頂部的距離

        // 當圖片的上邊界提前進入視窗時開始顯示並滑入
        if (imageTop <= (scrollPosition + windowHeight + offset)) {
            const progress = Math.min(1, (scrollPosition + windowHeight + offset - imageTop) / windowHeight);  // 計算進度
            const transformValue = Math.max(0, Math.min(100, progress * 100));  // 控制圖片的平移距離
            image.style.transform = `translateX(${100 - transformValue}%)`;  // 控制平移量
            image.style.opacity = progress;  // 隨著滾動逐漸顯示圖片
        }
    });
});

$(window).on('scroll', function() {
    const scrollPosition = $(window).scrollTop();  // 當前滾動位置
    const windowHeight = $(window).height();  // 視窗高度
    const offset = 150;  // 提前顯示的距離，數值越小圖片越早顯示

    $('.scroll-image').each(function() {
        const imageTop = $(this).offset().top;  // 圖片距離頁面頂部的距離

        // 當圖片的上邊界提前進入視窗時開始顯示並滑入
        if (imageTop <= (scrollPosition + windowHeight + offset)) {
            const progress = Math.min(1, (scrollPosition + windowHeight + offset - imageTop) / windowHeight);  // 計算進度
            const transformValue = Math.max(0, Math.min(100, progress * 100));  // 控制圖片的平移距離
            $(this).css({
                'transform': `translateX(${100 - transformValue}%)`,
                'opacity': progress
            });
        }
    });
});

// 正確答案
// const correctAnswers = {
//     snack1: "", // 豬血湯
//     store1: "", // 溪口古早味豬血湯
//     snack2: "", // 煎盤粿
//     store2: "", // 中正路煎盤米果
//     snack3: "", // 烤玉米
//     store3: "", // 溪口廟口古早味烤玉米
//     snack4: "", // 蚵嗲
//     store4: "", // 溪口蚵嗲黑輪攤
//     snack5: "", // 肉圓
//     store5: ""  // 溪口肉圓
// };

const correctAnswers = {
    snack1: "A", // 豬血湯
    store1: "E", // 溪口古早味豬血湯
    snack2: "D", // 煎盤粿
    store2: "B", // 中正路煎盤米果
    snack3: "E", // 烤玉米
    store3: "C", // 溪口廟口古早味烤玉米
    snack4: "B", // 蚵嗲
    store4: "D", // 溪口蚵嗲黑輪攤
    snack5: "C", // 肉圓
    store5: "A"  // 溪口肉圓
};

function checkAnswers() {
    function getValueOrDefault(id, defaultValue = "") {
        const element = document.getElementById(id);
        return element ? element.value : defaultValue;
    }

    // 使用函式生成 userAnswers
    const userAnswers = {
        snack1: getValueOrDefault("snack1"),
        store1: getValueOrDefault("store1"),
        snack2: getValueOrDefault("snack2"),
        store2: getValueOrDefault("store2"),
        snack3: getValueOrDefault("snack3"),
        store3: getValueOrDefault("store3"),
        snack4: getValueOrDefault("snack4"),
        store4: getValueOrDefault("store4"),
        snack5: getValueOrDefault("snack5"),
        store5: getValueOrDefault("store5"),
    };
    let allCorrect = true;
    let score = 0; // 分數計算
    let totalQuestions = Object.keys(correctAnswers).length / 2; // 總題目數
    let feedback = "";

    for (let key in correctAnswers) {
        const questionNumber = key.match(/\d+/)[0]; // 獲取題號
        const container = document.getElementById(`question${questionNumber}-container`);

        if (userAnswers[key] === correctAnswers[key]) {
            score++;
            if (container) {
                container.style.backgroundColor = "#d4edda"; // 將正確答案容器設為淺綠色
            }
        } else {
            allCorrect = false;
            if (container) {
                container.style.backgroundColor = "#f8d7da"; // 將錯誤答案容器設為淺紅色
            }
        }
    }

    // 更新結果區域
    if (allCorrect) {
        document.body.classList.add("success-animation"); // 添加成功動畫類別
        feedback += `<h2>🎉 恭喜！全部答對！🎉</h2>`;
    } else {
        document.body.classList.remove("success-animation");
        feedback += `<h2>請再接再厲！</h2>`;
    }

    const resultDiv = document.getElementById("resultans");
    if (resultDiv) {
        resultDiv.innerHTML = `<h3>您得分：${score} / ${totalQuestions * 2}</h3>${feedback}`;
    } else {
        const newResultDiv = document.createElement("div");
        newResultDiv.id = "resultans";
        newResultDiv.innerHTML = `<h3>您得分：${score} / ${totalQuestions * 2}</h3>${feedback}`;
        document.body.appendChild(newResultDiv);
    }
}

document.addEventListener("scroll", function () {
    const scrollContainer = document.querySelector("#闖關遊戲");
    const leftGyro = document.querySelector(".left-gyro");
    const rightGyro = document.querySelector(".right-gyro");

    // 獲取滾動容器的邊界位置
    const rect = scrollContainer.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // 當滾動區域進入視窗範圍時
    if (rect.top < windowHeight && rect.bottom > 0) {
        // 計算滾動進度 (0 到 1 之間)
        const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / rect.height));
        
        // 設定曲線路徑的參數
        const amplitude = 200; // 曲線振幅
        const frequency = 5; // 曲線頻率
        const speedFactor = 0.3; // 減速因子，控制移動速度
        // 計算水平位置（使用正弦函數創建波浪效果）
        const leftOffset = Math.sin(progress * Math.PI * frequency) * amplitude * speedFactor;
        const rightOffset = -Math.sin(progress * Math.PI * frequency) * amplitude * speedFactor;
        
        // 計算垂直位置
        const verticalOffset = progress * rect.height * speedFactor;

        // 應用變換
        leftGyro.style.transform = `translate(${leftOffset}px, ${verticalOffset}px)`;
        rightGyro.style.transform = `translate(${rightOffset}px, ${verticalOffset}px)`;
        
        // 確保元素可見
        leftGyro.style.display = 'block';
        rightGyro.style.display = 'block';
        leftGyro.style.opacity = 1; // 恢復可見
        rightGyro.style.opacity = 1; // 恢復可見
    } else {
        // 滾動區域不在範圍內，重置為初始位置並且透明
        leftGyro.style.top = "0%";
        rightGyro.style.top = "0%";
        
        // 設置透明度為 0，讓元素隱形
        leftGyro.style.opacity = 0;
        rightGyro.style.opacity = 0;
    }
});

$(document).ready(function(){
    $(".page-scroll").click(function(e){
        e.preventDefault();  // 防止點擊後頁面跳動
        $("#logo").fadeOut(); // 用淡出效果隱藏 logo
    });
});

