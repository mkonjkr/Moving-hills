"use strict";
export class Hill {
    constructor(color, speed, total) {
        this.color = color;
        this.speed = speed;
        this.total = total;
    }

    resize(stageWidth, stageHeight) {
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;

        this.points = [];
        // total 갯수에서 -2 정도해서 stage 보다 좀 더 크게 그린다
        // 양을 그릴때 밖에서부터 자연스럽게 걸어오는 모습을 위해
        this.gap = Math.ceil(this.stageWidth / (this.total - 2));

        for (let i =0; i < this.total; i++) {
            this.points[i] = {
                x: i* this.gap,
                y: this.getY()
            }
        }
    }

    // drawing hills
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();

        let cur = this.points[0];
        let prev = cur;

        
        //양의 좌표 위해서 점 위치 배열 저장
        let dots = [];
        // hills speed
        cur.x += this.speed;

        // 언덕 짤림 방지 첫번째 x 좌표가 화면 밖으로 나오기 전에
        // 새로운 배열을 앞에 넣어줌
        // 일정영역 이상을 벗어나면 배열을 빼줘서 끊임없이 나오게
        if (cur.x > -this.gap) {
            this.points.unshift({
                x: -(this.gap * 2),
                y: this.getY()
            });
        } else if (cur.x > this.stageWidth + this.gap) {
            this.points.splice(-1);
        }

        ctx.moveTo(cur.x, cur.y);

        let prevCx = cur.x;
        let prevCy = cur.y;

        for (let i =1; i < this.points.length; i++) {
            cur = this.points[i];
            // hills speed
            cur.x += this.speed;
            const cx = (prev.x + cur.x) / 2;
            const cy = (prev.y + cur.y) / 2;
            ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);

            dots.push({
                x1: prevCx,
                y1: prevCy,
                x2: prev.x,
                y2: prev.y,
                x3: cx,
                y3: cy
            });

            prev = cur;
            prevCx = cx;
            prevCy = cy;
        }
        ctx.lineTo(prev.x, prev.y);
        ctx.lineTo(this.stageWidth, this.stageHeight);
        ctx.lineTo(this.points[0].x, this.stageHeight);
        ctx.fill();

        return dots;
    }

    //assign Y position randomly
    getY() {
        // stage 높이를 8정도로 나눈 값을 기준으로 랜덤 리턴
        const min = this.stageHeight / 8;
        const max = this.stageHeight - min;
        return min + Math.random() * max;
    }
}