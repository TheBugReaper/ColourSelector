/**
 * Created by Aalphe on 2017/3/1.
 */
var firstCanvas = document.getElementById("First-Selector");
var firstCtx = firstCanvas.getContext("2d");
var secondCanvas = document.getElementById("Second-Selector");
var secondCtx = secondCanvas.getContext("2d");
var preview = document.getElementById("Colour-Preview");
var previewCtx = preview.getContext("2d");

var form = document.getElementById("form");

var h, s, l;

/**
 * 初始化
 */
function init(){
    h = 0;
    s = 0.5;
    l = 0.5;
    refresh();
}

/**
 * 刷新所有色彩
 */
function refresh(){
    refreshFirst(h, s, l);
    refreshSecond(h, s, l);
    refreshPreview(h, s, l);
    refreshForm(h, s, l);
}

/**
 * 刷新主要选择区域
 * @param hue 色调
 * @param sat 饱和度
 * @param lig 亮度
 */
function refreshFirst(hue, sat, lig){
    var h, s, l;
    if(h == hue){
        firstCtx.restore();
    } else {
        h = hue;
        for (s = 0; s < 360; s++){
            for (l = 0; l < 360; l++){
                rgb = HSLtoRGB({
                    H : h,
                    S : s / 360,
                    L : l / 360
                });
                r = rgb.R.toString(16);
                if (r.length < 2){
                    r = "0" + r;
                }
                g = rgb.G.toString(16);
                if (g.length < 2){
                    g = "0" + g;
                }
                b = rgb.B.toString(16);
                if (b.length < 2){
                    b = "0" + b;
                }
                colour = "#" + r + g + b;
                firstCtx.fillStyle = colour;
                firstCtx.fillRect(s, l, 1,1);
            }
        }
        firstCtx.save();    //对背景色彩进行存储方便刷新
    }

    /*绘制光标*/
    firstCtx.strokeStyle = "#FF0000";
    firstCtx.beginPath();
    firstCtx.arc(sat*360, lig*360, 5, 0, Math.PI * 2, true);
    firstCtx.stroke();
}

/**
 * 主要选择区域点击事件绑定
 * @param e
 */
firstCanvas.onmousedown = function(e){
    e = e || event;
    var x = e.clientX - firstCanvas.offsetLeft;
    var y = e.clientY - firstCanvas.offsetTop;
    s = x / 360;
    l = y / 360;
    refresh();
};

/**
 * 刷新色调选择器显示
 * @param hue 色调
 */
function refreshSecond(hue){
    var h, s, l, rgb;
    s = 1;
    l = 0.5;
    for(h = 0; h < 360; h++){
        rgb = HSLtoRGB({
            H : h,
            S : s,
            L : l
        });
        r = rgb.R.toString(16);
        if (r.length < 2){
            r = "0" + r;
        }
        g = rgb.G.toString(16);
        if (g.length < 2){
            g = "0" + g;
        }
        b = rgb.B.toString(16);
        if (b.length < 2){
            b = "0" + b;
        }
        colour = "#" + r + g + b;
        secondCtx.fillStyle = colour;
        secondCtx.fillRect(0, h, 10, 1);
    }
    /*绘制光标*/
    secondCtx.strokeStyle = "#FF0000";
    secondCtx.beginPath();
    secondCtx.arc(5, hue, 5, 0, Math.PI * 2, true);
    secondCtx.stroke();
}

/**
 * 色调选择器点击事件绑定
 * @param e
 */
secondCanvas.onmousedown = function(e){
    e = e || event;
    var y = e.clientY - secondCanvas.offsetTop;
    h = y;
    s = 0.5;
    l = 0.5;
    refresh();
};

/**
 * 色彩预览区域刷新
 * @param h 色调
 * @param s 饱和度
 * @param l 亮度
 */
function refreshPreview(h, s, l){
    var r, g, b, rgb, colour;
    rgb = HSLtoRGB({
        H : h,
        S : s,
        L : l
    });
    r = rgb.R.toString(16);
    if (r.length < 2){
        r = "0" + r;
    }
    g = rgb.G.toString(16);
    if (g.length < 2){
        g = "0" + g;
    }
    b = rgb.B.toString(16);
    if (b.length < 2){
        b = "0" + b;
    }
    colour = "#" + r + g + b;
    previewCtx.fillStyle = colour;
    previewCtx.fillRect(0, 0, 50, 50);
}

/**
 * 表单同步刷新
 * @param h 色调
 * @param s 饱和度
 * @param l 灰度
 */
function refreshForm(h, s, l){
    form["h"].value = h;
    form["s"].value = s.toFixed(3);
    form["l"].value = l.toFixed(3);
    rgb = HSLtoRGB({
        H : h,
        S : s,
        L : l
    });
    r = rgb.R;
    g = rgb.G;
    b = rgb.B;
    form["r"].value = r;
    form["g"].value = g;
    form["b"].value = b;
}

/**
 * 表单中RGB值发生改变时的调用函数
 */
function onChangeRGB(){
    var r, g, b;
    r = form["r"].value;
    g = form["g"].value;
    b = form["b"].value;
    var hsl = RGBtoHSL({
        R : r,
        G : g,
        B : b
    });
    h = hsl.H;
    s = hsl.S;
    l = hsl.L;
    refresh();
}

/**
 * 表单中HSL值发生改变时的调用函数
 */
function onChangeHSL(){
    h = form["h"].value;
    s = form["s"].value;
    l = form["l"].value;
    refresh();
}

/**
 * RGB值转换成HSL值
 * @param RGB
 * @returns {{H: number, S: number, L: number}}
 * @constructor
 */
function RGBtoHSL(RGB){
    var maxColour = Math.max(RGB.R, RGB.G, RGB.B);
    var minColour = Math.min(RGB.R, RGB.G, RGB.B);
    var l = (maxColour+minColour)/255/2;
    var s, h;
    s = 0;
    h = 0;
    /* 若最大rgb值与最小rgb值相等，则说明是灰色，饱和度为0，色调为任意值 */
    if(maxColour == minColour) {

    } else {

        if(l<0.5) {
            s = (maxColour - minColour)/ (maxColour + minColour);
        } else {
            s = (maxColour - minColour) / (2.0*255 - maxColour - minColour);
        }

        //计算色调
        if(maxColour == RGB.R){
            h = (RGB.G - RGB.B) / (maxColour - minColour);
        }
        else if(maxColour == RGB.G){
            h = 2.0 + (RGB.B - RGB.R) / (maxColour - minColour);
        }
        else if(maxColour == RGB.B){
            h = 4.0 + (RGB.R - RGB.G) / (maxColour - minColour);
        }
        h = h * 60;
        if(h<0) {
            h += 360;
        }
    }
    return {
        H : h,
        S : s,
        L : l
    };
}

/**
 * HSL值转换成RGB值
 * @param HSL
 * @returns {{R: number, G: number, B: number}}
 * @constructor
 */
function HSLtoRGB(HSL){
    var r, g, b;
    var temp1, temp2, temp3;
    temp3 = [0, 0, 0];
    if(HSL.S == 0) {
        r = g = b = HSL.L;
    } else {
        temp2 = (HSL.L < 0.5) ? HSL.L * (1.0 + HSL.S) : HSL.L + HSL.S - HSL.L * HSL.S;
        temp1 = 2.0 * HSL.L - temp2;
        var h = HSL.H * 1.0/ 360.0;
        temp3[0] = h + 1.0/3.0;
        temp3[1] = h;
        temp3[2] = h - 1.0/3.0;
        for (var i=0; i < 3; i++){
            if(temp3[i] < 0) temp3[i] += 1;
            if(temp3[i] > 1) temp3[i] -= 1;
            if(temp3[i] * 6 < 1){
                temp3[i] = temp1+(temp2-temp1)*6.0*temp3[i];
            }
            else if(temp3[i] * 2.0 < 1){
                temp3[i] = temp2;
            }
            else if(temp3[i] * 3.0 < 2){
                temp3[i] = temp1+(temp2-temp1)*((2.0/3.0)-temp3[i])*6.0
            }
            else {
                temp3[i] = temp1;
            }
        }
        r = temp3[0];
        g = temp3[1];
        b = temp3[2];
    }
    return {
        R : Math.floor((255 * r)),
        G : Math.floor((255 * g)),
        B : Math.floor((255 * b))
    };
}
