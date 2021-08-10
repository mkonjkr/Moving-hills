export class Sheep {
    constructor(img, stageWidth) {
        this.img = img;

        // 양 그림이 8 프레임이
        this.totalFrame = 8;
        // 현재 프레임을 0으로 정의
        this.curFrame = 0;

        // 이미지 크기는 양 그림 한장의 가로 세로
        this.imgWidth = 360;
        this.imgHeight = 300;

        // 그려질 양의 크기는 레티나 디스플레이를 감안해서 절반 사이즈로
        this.sheepWidth = 180;
        this.sheepHeight = 150;

        this.sheepWidthHalf = this.sheepWidth / 2;
        this.x = stageWidth + this.sheepWidth;
        this.y = 0;
        // 속도 랜덤 정의
        this.speed = Math.random() * 1.5 + 1;

        // fps를 어도비 애니메이터에서 그린 24로 똑같이
        this.fps = 24;
        this.fpsTime = 1000 / this.fps;
    }

    draw(ctx, t, dots) {

        if (!this.time) {
            this.time = t;
        }

        // 매번 프레임을 증가시키는게 아니라 fps시간과 비교해서
        // 그 시간에 도달했을때만 프레임 증가
        // 프레임을 증가 시키는 속도를 시간에 맞춰서
        // 이 코드 지우면 양 빠름
        const now = t - this.time;
        if (now > this.fpsTime) {
            this.time = t;
             //현재 프레임 증가
             this.curFrame += 1;
             // 현재 프레임이 토탈 프레임보다 커지면 안되니가 리셋
             if (this.curFrame == this.totalFrame) {
                 this.curFrame = 0;
                }
            }

        this.animate(ctx, dots);
    }

    animate(ctx, dots) {
        // 하단 중앙을 중심정으로 하기 위해서
        
        // 양의 x 값을 stage 넓이에 양의 넓이를 더한만큼을 초기값 지정
        // 거기에 속도를 계속 빼준다
        this.x -= this.speed;
        //this.y = 550;
        
        const closest = this.getY(this.x, dots);
        this.y = closest.y;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(closest.rotation);

        //ctx.fillStyle = '#000000';

        //양 그리기
        ctx.drawImage(
            this.img,
            this.imgWidth * this.curFrame,
            0,
            this.imgWidth,
            this.imgHeight,
            -this.sheepWidthHalf,
            -this.sheepHeight +20,
            this.sheepWidth,
            this.sheepHeight
        );
        // 네모 사각형 그리기
        /* ctx.fillRect(
            // x를 -양의 절반 
            -this.sheepWidthHalf,
            // y를 -양의 높이 +20은 그림에서 생기는 영역만큼 더한값
            -this.sheepHeight,
            // 양의 크기만큼 넓이와 높이 지정
            this.sheepWidth,
            this.sheepHeight
        ); */
        // restore해서 저장했던 캔버스를 복귀
        ctx.restore();
    }

    getY(x, dots) {
        for (let i = 1; i < dots.length; i++) {
            if (x >=dots[i].x1 && x <= dots[i].x3) {
                return this.getY2(x, dots[i]);
            }
        }

        return {
            y: 0,
            rotation: 0
        };
    }

    getY2(x, dot) {
        const total = 200;
        let pt = this.getPointOnQuad(dot.x1, dot.y1, dot.x2, dot.y2, dot.x3, dot.y3, 0);
        let prevX = pt.x;
        for (let i = 1; i < total; i++) {
            const t = i / total;
            pt = this.getPointOnQuad(dot.x1, dot.y1, dot.x2, dot.y2, dot.x3, dot.y3, t);

            if (x >= prevX && x <= pt.x) {
                return pt;
            }
            prevX = pt.x;
        }
        return pt;
    }

    getQuadValue(p0, p1, p2, t) {
        return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t *p1 + t * t * p2; 
    }

    getPointOnQuad(x1, y1, x2, y2, x3, y3, t) {
        // 언덕 기울기
        const tx = this.quadTangent(x1, x2, x3, t);
        const ty = this.quadTangent(y1, y2, y3, t);
        // atan2 각도 구하는 함수
        // 수직의 각도 구하는거라 수평으로 변환하려면 +90
        // atan2는 리턴을 라디안값을 리턴함
        // 그래서 math.pi/180 은  디그리를 라디안으로 변환
        const rotation = -Math.atan2(tx, ty) + (90 * Math.PI / 180);

        return {
            x: this.getQuadValue(x1, x2, x3, t),
            y: this.getQuadValue(y1, y2, y3, t),
            rotation: rotation,
        };
    }

    quadTangent(a, b, c, t) {
        return 2 * (1 - t) * (b - a) + 2 * (c - b) * t;
    }
}