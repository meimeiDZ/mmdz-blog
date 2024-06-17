// 不同人物形象 
// 黑猫 hijiki = "https://unpkg.com/live2d-widget-model-hijiki@1.0.5/assets/hijiki.model.json" 
// 白猫 tororo = "https://unpkg.com/live2d-widget-model-tororo@1.0.5/assets/tororo.model.json" 
// 狗狗 wanko = "https://unpkg.com/live2d-widget-model-wanko@1.0.5/assets/wanko.model.json" 
// 人物 koharu = "https://unpkg.com/live2d-widget-model-koharu@1.0.5/assets/koharu.model.json" 
// 人物 shizuku = "https://unpkg.com/live2d-widget-model-shizuku@1.0.5/assets/shizuku.model.json" 
// 人物 z16 = "https://unpkg.com/live2d-widget-model-z16@1.0.5/assets/z16.model.json"
wanko = "https://unpkg.com/live2d-widget-model-wanko@1.0.5/assets/wanko.model.json"
L2Dwidget.init({
    "model": {
        // 在这里使用上面的人物名称替换“shizuku”，可以切换人物形象
        jsonPath: wanko,
        "scale": 1
    },
    "display": {
        "position": "right", //看板娘的表现位置
        "width": 120, //看板娘的宽度
        "height": 150, //看板娘的高度
        "hOffset": 0, //看板娘 x轴，水平位置
        "vOffset": -20
    },
    "mobile": {
        "show": true,
        "scale": 0.5
    },
    "react": {
        "opacityDefault": 0.7,
        "opacityOnHover": 0.2
    }
});