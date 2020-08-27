import { panelList } from '../src/Config/config';
import React, { useEffect } from 'react';
import './pannel.scss';
import Header from '../src/components/Header';
import { DomUtils } from '@powerfulyang/utils';

const Panel = () => {
  useEffect(() => {
    (function () {
      let canvas,
        ctx,
        width,
        height,
        bubbles,
        // eslint-disable-next-line prefer-const
        animateHeader = true;
      DomUtils.contentLoaded(() => {
        initHeader();
      });

      function initHeader() {
        canvas = document.getElementById('header_canvas');
        window_resize();
        ctx = canvas.getContext('2d');
        //建立泡泡
        bubbles = [];
        const num = width * 0.04; //气泡数量
        for (let i = 0; i < num; i++) {
          const c = new Bubble();
          bubbles.push(c);
        }
        animate();
      }

      function animate() {
        if (animateHeader) {
          ctx.clearRect(0, 0, width, height);
          for (const i of bubbles) {
            i.draw();
          }
        }
        requestAnimationFrame(animate);
      }

      function window_resize() {
        //canvas铺满窗口
        //width = window.innerWidth;
        //height = window.innerHeight;

        //如果需要铺满内容可以换下面这个
        const panel = document.getElementById('panel');
        width = panel.offsetWidth;
        height = panel.offsetHeight;

        canvas.width = width;
        canvas.height = height;
      }

      window.onresize = function () {
        window_resize();
      };

      function Bubble() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _this = this;
        (function () {
          _this.pos = {};
          init();
        })();

        function init() {
          _this.pos.x = Math.random() * width;
          _this.pos.y = height + Math.random() * 100;
          _this.alpha = 0.1 + Math.random() * 0.3; //气泡透明度
          _this.alpha_change = 0.0002 + Math.random() * 0.0005; //气泡透明度变化速度
          _this.scale = 0.2 + Math.random() * 0.5; //气泡大小
          _this.scale_change = Math.random() * 0.002; //气泡大小变化速度
          _this.speed = 0.1 + Math.random() * 0.4; //气泡上升速度
        }

        //气泡
        this.draw = function () {
          if (_this.alpha <= 0) {
            init();
          }
          _this.pos.y -= _this.speed;
          _this.alpha -= _this.alpha_change;
          _this.scale += _this.scale_change;
          ctx.beginPath();
          ctx.arc(_this.pos.x, _this.pos.y, _this.scale * 10, 0, 2 * Math.PI, false);
          ctx.fillStyle = 'rgba(255,255,255,' + _this.alpha + ')';
          ctx.fill();
        };
      }
    })();
  }, []);
  return (
    <>
      <Header title="panel" />
      <canvas id="header_canvas" />
      <div id="panel" className="content">
        <div className="panels">
          {panelList.map((item) => {
            return (
              <div className="contain-box" key={item.name}>
                <div className="title">
                  <a href={item.url}>{item.name}</a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Panel;
