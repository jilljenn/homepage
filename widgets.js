function imageWidget (options) {
    var that = positionnableObject(options);

    that.ctx = options.ctx;
    that.image = options.image;

    that.draw = function (offX, offY) {
        if (typeof(offX) == 'undefined') offX = 0;
        if (typeof(offY) == 'undefined') offY = 0;

        that.ctx.drawImage(that.image, 0, 0, that.image.width, that.image.height, that.absPos.x + offX, that.absPos.y + offY, that.image.width, that.image.height);
    }

    that.getSize = function () {
        return {w: that.image.width, h: that.image.height};
    }

    that.updateSize();

    return that;
}

function textWidget (options) {
    var that = positionnableObject(options);

    that.text = options.text;
    that.font = options.font;
    
    that.draw = function (offX, offY) {
        if (typeof(offX) == 'undefined') offX = 0;
        if (typeof(offY) == 'undefined') offY = 0;

        that.font.drawStr(that.text, that.absPos.x + offX, that.absPos.y + offY);
    }

    that.getSize = function () {
        nbCRLF = 0;
        biggestLine = 0;
        currLine = 0;

        for (var i = 0; i < that.text.length; i++) {
            if (that.text[i] == '\n') {
                nbCRLF += 1;
                biggestLine = Math.max(currLine, biggestLine);
                currLine = 0;
            }
            else {
                currLine += that.font.getCharSize(that.text[i]);
            }
        }

        biggestLine = Math.max(currLine, biggestLine);

        return {w: biggestLine, h: (nbCRLF+1) * that.font.sprSh.frameH};
    }

    that.updateSize();

    return that;
}

function buttonWidget (options) {
    var that = positionnableObject(options);

    that.sprSh = options.spritesheet;
    that.sprOnId = options.sprOnId;
    that.sprOffId = options.sprOffId;
    that.hoverSprId = options.hoverSprId;
    that.callback = options.callback;
    that.size = {w: that.sprSh.width, h: that.sprSh.height};

    if (options.hasOwnProperty("state"))
        that.state = options.state;
    else
        that.state = false;


    that.parent = null;
    
    that.draw = function (offX, offY) {
        if (typeof(offX) == 'undefined') offX = 0;
        if (typeof(offY) == 'undefined') offY = 0;

        if (that.state) {
            that.sprSh.drawFrame(that.sprOnId, that.absPos.x + offX, that.absPos.y + offY)
        }
        else {
            that.sprSh.drawFrame(that.sprOffId, that.absPos.x + offX, that.absPos.y + offY)
        }
    }

    that.setSize(that.sprSh.frameW, that.sprSh.frameH);

    return that;
}

function dotMeterWidget (options) {
    var that = positionnableObject(options);

    that.ctx = options.ctx;
    that.max = options.max;
    that.value = options.value;
    that.spaceBetweenDots = 0;
    
    that.dotSprSh = spritesheet({
        ctx: ctx,
        image: rscManager.getRscData("ui-misc-small"),
        nbFrameW: 2,
        nbFrameH: 2,
    });    

    that.draw = function (offX, offY) {
        if (typeof(offX) == 'undefined') offX = 0;
        if (typeof(offY) == 'undefined') offY = 0;

        for (var i = 1; i <= that.max; i++) { 
            /*that.ctx.beginPath();
            that.ctx.arc(that.pos.x + (i-1) * 10 + offX, that.pos.y + offY, 3, 0, 2 * Math.PI, false);
            if (i <= that.value) {
                that.ctx.fillStyle = 'white';
            }
            else {
                that.ctx.fillStyle = 'black';
            }
            that.ctx.fill();
            that.ctx.lineWidth = 1;
            that.ctx.strokeStyle = '#FFFFFF';
            that.ctx.stroke();*/

            if (i <= that.value)
                that.dotSprSh.drawFrame(1, that.absPos.x + (i-1) * (that.dotSprSh.frameW + that.spaceBetweenDots) + offX, that.absPos.y + offY);
            else
                that.dotSprSh.drawFrame(0, that.absPos.x + (i-1) * (that.dotSprSh.frameW + that.spaceBetweenDots) + offX, that.absPos.y + offY);
        }
    }

    that.getSize = function () {
        return {w: (that.max - 1) * (that.dotSprSh.frameW + that.spaceBetweenDots) + that.dotSprSh.frameW, h: that.dotSprSh.frameH};
    }

    that.updateSize();

    return that;
}

function dotBarWidget (options) {
    var that = positionnableObject(options);

    that.ctx = options.ctx;
    that.nbDots = options.nbDots;
    that.selectedDot = options.selectedDot;
    that.spaceBetweenDots = 0;
    that.onSelectCallback = null;

    if (options.hasOwnProperty("onSelectCallback")) {
        that.onSelectCallback = options.onSelectCallback;
    }

    that.dotSprSh = spritesheet({
        ctx: ctx,
        image: rscManager.getRscData("ui-misc-small"),
        nbFrameW: 2,
        nbFrameH: 2,
    });
    
    that.draw = function (offX, offY) {
        if (typeof(offX) == 'undefined') offX = 0;
        if (typeof(offY) == 'undefined') offY = 0;

        for (var i = 1; i <= that.nbDots; i++) { 
            /*that.ctx.beginPath();
            that.ctx.arc(that.absPos.x + offX, that.absPos.y + (i-1) * 10 + offY, 3, 0, 2 * Math.PI, false);
            if (i == that.selectedDot) {
                that.ctx.fillStyle = 'white';
            }
            else {
                that.ctx.fillStyle = 'black';
            }
            that.ctx.fill();
            that.ctx.lineWidth = 1;
            that.ctx.strokeStyle = '#FFFFFF';
            that.ctx.stroke();*/

            if (i == that.selectedDot)
                that.dotSprSh.drawFrame(1, that.absPos.x, that.absPos.y + (i-1) * that.dotSprSh.frameH);
            else
                that.dotSprSh.drawFrame(0, that.absPos.x, that.absPos.y + (i-1) * that.dotSprSh.frameH);
        }
    }

    that.getSize = function () {
        return {w: that.dotSprSh.frameW,
                h: (that.nbDots - 1) * (that.dotSprSh.frameH + that.spaceBetweenDots) + that.dotSprSh.frameH};
    }

    that.setNbDots = function (newNbDots) {
        that.nbDots = newNbDots;
        that.updateSize();
    }

    that.onMouseDown = function (mousePos) {
        var btnHitId = Math.floor((mousePos.y - that.rect.t) / that.size.h * that.nbDots);

        if (btnHitId != (that.selectedDot - 1) && that.onSelectCallback != null) {
            that.onSelectCallback(btnHitId);
        }
    }

    that.updateSize();

    return that;
}

// ATTENTION il FAUT un parent
function scrollBarWidget (options) {
    var that = positionnableObject(options);

    that.ctx = options.ctx;
    that.overflow = options.overflow;
    that.scrollPos = options.scrollPos;
    that.lastMousePos = null;

    that.animReturnStartT = -1;
    that.animReturnEndT = -1;

    that.draw = function () {
        if (that.overflow.y > 0) {
            that.ctx.beginPath();

            var scrollPosToAdd = that.scrollPos.y;

            that.ctx.fillStyle = 'white';
            that.ctx.fillRect(that.absPos.x,
                              that.absPos.y + scrollPosToAdd,
                              that.size.w,
                              that.size.h - that.overflow.y);

            if (that.animReturnStartT >= 0) {
                var currTime = new Date().getTime();
                if (that.animReturnEndT < currTime) {
                    that.animReturnStartT = -1;
                    that.animReturnEndT = -1;
                    that.animReturnStartPos = -1;
                    that.animReturnEndPos = -1;
                }
                else {
                    that.scrollPos.y = Math.round(easeInOutQuad(currTime - that.animReturnStartT, that.animReturnStartPos, that.animReturnEndPos - that.animReturnStartPos, that.animReturnEndT - that.animReturnStartT));
                }
            }
        }
    }

    that.onMouseDown = function (mousePos) {
        siteCanvas.registerWidgetForMouseInput(that);
        that.lastMousePos = mousePos;
    }

    that.onMouseMove = function (mousePos) {
        if (that.lastMousePos != null) {
            that.addScroll(mousePos.y - that.lastMousePos.y);
        }
        that.lastMousePos = mousePos;
    }

    that.onMouseUp = function (mousePos) {
        siteCanvas.unregisterWidgetForMouseInput(that);
        that.lastMousePos = null;

        if (that.scrollPos.y > that.overflow.y || that.scrollPos.y < 0) {
            var currTime = new Date().getTime();

            that.animReturnStartT = currTime;
            that.animReturnEndT = currTime + 200;
            that.animReturnStartPos = that.scrollPos.y;

            if (that.scrollPos.y > that.overflow.y)
                that.animReturnEndPos = that.overflow.y;
            else
                that.animReturnEndPos = 0;
        }
    }

    that.addScroll = function (scrollAmount) {
        //if (that.scrollPos.y + scrollAmount >= 0 && that.scrollPos.y + scrollAmount <= that.overflow.y) {
            that.scrollPos.y += scrollAmount;
            that.updateRect();
        //}
    }

    return that;
}

function progressBarWidget (options) {
    var that = positionnableObject(options);

    that.ctx = options.ctx;
    that.size = options.size;
    that.min = options.min;
    that.max = options.max;
    that.value = options.value;

    that.setValue = function (newValue) {
        that.value = Math.min(Math.max(0, newValue), that.max);
    }

    that.draw = function () {
        var barFillWidth = Math.floor((that.size.w-2) / that.max * that.value);

        that.ctx.fillStyle = "black";
        that.ctx.fillRect(that.absPos.x, that.absPos.y, that.size.w, that.size.h);
        that.ctx.fillStyle = "white";
        that.ctx.fillRect(that.absPos.x+1, that.absPos.y+1, that.size.w-2, that.size.h-2);
        that.ctx.fillStyle = "black";
        that.ctx.fillRect(that.absPos.x+1 + barFillWidth, that.absPos.y+1, that.size.w-2 - barFillWidth, that.size.h-2);
    }

    return that;
}