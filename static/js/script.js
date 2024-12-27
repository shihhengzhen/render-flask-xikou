// 取得骰子容器
const diceContainer = document.getElementById("diceContainer");

// 初始化 Three.js 場景
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    diceContainer.offsetWidth / diceContainer.offsetHeight,
    0.1,
    1000
);
camera.position.z = 3; // 確保相機正對骰子

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(diceContainer.offsetWidth, diceContainer.offsetHeight);
diceContainer.appendChild(renderer.domElement);

// 添加光線
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 2);
scene.add(directionalLight);

// 創建骰子材質 (六個面)
const loader = new THREE.TextureLoader();
const textures = [
    loader.load('static/img/dice4.png', undefined, undefined, (error) => console.error('Failed to load dice1 texture', error)),
    loader.load('static/img/dice3.png', undefined, undefined, (error) => console.error('Failed to load dice2 texture', error)),
    loader.load('static/img/dice5.png', undefined, undefined, (error) => console.error('Failed to load dice3 texture', error)),
    loader.load('static/img/dice2.png', undefined, undefined, (error) => console.error('Failed to load dice4 texture', error)),
    loader.load('static/img/dice1.png', undefined, undefined, (error) => console.error('Failed to load dice5 texture', error)),
    loader.load('static/img/dice6.png', undefined, undefined, (error) => console.error('Failed to load dice6 texture', error)),
];
const materials = textures.map(texture => new THREE.MeshStandardMaterial({ map: texture }));

// 建立骰子
const geometry = new THREE.BoxGeometry(2, 2, 2);
const dice = new THREE.Mesh(geometry, materials);
scene.add(dice);

// 更新渲染器大小 (因應視窗調整)
window.addEventListener("resize", () => {
    const width = diceContainer.offsetWidth;
    const height = diceContainer.offsetHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// 動畫函數
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// 清除所有高亮
function resetHighlight() {
    for (let i = 1; i <= 6; i++) {
        const input = document.getElementById(`food${i}`);
        input.classList.remove("highlight");
    }
}

// 高亮對應選項
function highlightChoice(face) {
    const input = document.getElementById(`food${face}`);
    if (input) {
        input.classList.add("highlight");
    }
}

// 添加高亮樣式
const style = document.createElement("style");
style.innerHTML = `
    .highlight {
        background-color: yellow;
        transition: background-color 0.5s ease;
    }
`;
document.head.appendChild(style);

// 骰子旋轉函數
function rotateDice(face) {
    const rotations = {
        1: { x: 0, y: 0 },
        2: { x: -Math.PI / 2, y: 0 },
        3: { x: 0, y: Math.PI / 2 },
        4: { x: 0, y: -Math.PI / 2 },
        5: { x: Math.PI / 2, y: 0 },
        6: { x: Math.PI, y: 0 },
    };

    if (!rotations[face]) {
        console.error("Invalid dice face:", face);
        return;
    }

    // 清除之前的高亮
    resetHighlight();

    // 使用 GSAP 平滑旋轉，並在動畫完成後強制校正角度
    gsap.to(dice.rotation, {
        x: rotations[face].x,
        y: rotations[face].y,
        duration: 2,
        ease: "power2.inOut",
        onComplete: () => {
            dice.rotation.x = rotations[face].x;
            dice.rotation.y = rotations[face].y;
            dice.rotation.z = 0; // 確保沒有多餘的旋轉
            highlightChoice(face); // 動畫結束後亮燈
        },
    });
}

// 隨機旋轉函數
function randomRotate(duration) {
    const randomX = Math.random() * Math.PI * 2;
    const randomY = Math.random() * Math.PI * 2;
    const randomZ = Math.random() * Math.PI * 2;

    // 使用 GSAP 進行隨機旋轉
    return gsap.to(dice.rotation, {
        x: randomX,
        y: randomY,
        z: randomZ,
        duration: duration,
        ease: "power1.inOut",
    });
}

// 美食選項
const foods = [];
const items = ["古早味豬血湯", "白嫩嫩碗稞", "燒燒ㄟ肉羹", "比臉大肉圓", "綿綿芋粿巧", "古早味剉冰", "料多多肉粽", "甜甜鳥仔餅"];

// 「幫我抽」按鈕邏輯
document.getElementById("randomPickButton").addEventListener("click", () => {
    foods.length = 0; // 清空之前的選項
    for (let i = 1; i <= 6; i++) {
        const food = document.getElementById(`food${i}`).value.trim();
        if (food !== "") {
            foods.push(food);
        }
    }

    const resultElement = document.getElementById("randomPickResult");
    if (foods.length === 0) {
        resultElement.textContent = "請輸入至少一個美食！";
        return;
    }

    // 隨機選擇美食
    const randomIndex = Math.floor(Math.random() * foods.length);
    const randomFood = foods[randomIndex];
    resultElement.textContent = ``;
    //resultElement.textContent = `選到的美食是：${randomFood}`;

    // 隨機旋轉 3 秒後，旋轉到目標
    randomRotate(3).then(() => {
        rotateDice(randomIndex + 1); // 從 1 開始對應骰子面
    });
});

// 「隨機物品」按鈕邏輯
document.getElementById("randomItemButton").addEventListener("click", () => {
    const randomItem = items[Math.floor(Math.random() * items.length)];
    document.getElementById("randomItemResult").textContent = `${randomItem}`;
});
