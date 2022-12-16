import { useEffect } from 'react';
import * as THREE from 'three';
import * as d3 from 'd3';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import data from './data';
import mapPoints from './mapPoints';

const Index = () => {
  useEffect(() => {
    // div 的 dom 引用
    const box = document.getElementById('box') as HTMLDivElement;
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;

    const globeWidth = 2000;
    const globeHeight = 961;
    const globeRadius = 100; // 球体半径
    const globeSegments = 64; // 球体面数，数量越大越光滑，性能消耗越大

    let glRender: THREE.WebGLRenderer; // webgl渲染器
    let camera: THREE.PerspectiveCamera; // 摄像机
    let earthMesh:
      | THREE.Object3D<THREE.Event>
      | THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>; // 地球的Mesh
    let scene: THREE.Object3D<THREE.Event> | THREE.Scene; // 场景，一个大容器，可以理解为html中的body
    let meshGroup: THREE.Object3D<THREE.Event> | THREE.Group; // 所有mesh的容器，后面所有mesh都会放在这里面，方便我们管理，可理解为一个div
    let controls: OrbitControls; // 轨道控制器，实现整体场景的控制

    /**
     * 场景自适应
     */
    function resizeRendererToDisplaySize() {
      // 兼容视网膜屏
      const pixelRatio = window.devicePixelRatio;
      const width = box.offsetWidth * pixelRatio || 0;
      const height = box.offsetHeight * pixelRatio || 0;

      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        glRender.setSize(width, height, false);
      }
      return needResize;
    }

    /**
     * 2d的地图坐标转为球体3d坐标
     * @param x
     * @param y
     */
    function convertFlatCoordsToSphereCoords(x: number, y: number) {
      // Calculate the relative 3d coordinates using Mercator projection relative to the radius of the globe.
      // Convert latitude and longitude on the 90/180 degree axis.
      let latitude = ((x - globeWidth) / globeWidth) * -180;
      let longitude = ((y - globeHeight) / globeHeight) * -90;
      latitude = (latitude * Math.PI) / 180; // (latitude / 180) * Math.PI
      longitude = (longitude * Math.PI) / 180; // (longitude / 180) * Math.PI // Calculate the projected starting point

      const radius = Math.cos(longitude) * globeRadius;
      const targetX = Math.cos(latitude) * radius;
      const targetY = Math.sin(longitude) * globeRadius;
      const targetZ = Math.sin(latitude) * radius;
      return {
        x: targetX,
        y: targetY,
        z: targetZ,
      };
    }

    /**
     * 渲染场景
     */
    function screenRender() {
      // 更新
      if (resizeRendererToDisplaySize()) {
        const c = glRender.domElement;
        camera.aspect = c.clientWidth / c.clientHeight;
        camera.updateProjectionMatrix();
      }

      meshGroup.rotation.y += 0.001;
      glRender.render(scene, camera);
      controls.update();
      requestAnimationFrame(screenRender);
    }

    /**
     * 生成点状世界地图
     */
    function createMapPoints() {
      // 点的基本材质.
      const material = new THREE.MeshBasicMaterial({
        color: '#AAA',
      });

      const sphere = [];
      for (const point of mapPoints.points) {
        // 循环遍历所有点将2维坐标映射到3维坐标
        const pos = convertFlatCoordsToSphereCoords(point.x, point.y);
        if (pos.x && pos.y && pos.z) {
          // 生成点阵
          const pingGeometry = new THREE.SphereGeometry(0.4, 5, 5);
          pingGeometry.translate(pos.x, pos.y, pos.z);
          sphere.push(pingGeometry);
        }
      }
      // 合并所有点阵生成一个mesh对象
      const earthMapPoints = new THREE.Mesh(mergeBufferGeometries(sphere), material);
      meshGroup.add(earthMapPoints);
    }

    // 经纬度转成球体坐标
    function convertLatLngToSphereCoords(latitude: number, longitude: number, radius: number) {
      const phi = (latitude * Math.PI) / 180;
      const theta = ((longitude - 180) * Math.PI) / 180;
      const x = -(radius + -1) * Math.cos(phi) * Math.cos(theta);
      const y = (radius + -1) * Math.sin(phi);
      const z = (radius + -1) * Math.cos(phi) * Math.sin(theta);
      return {
        x,
        y,
        z,
      };
    }

    const domain = [1000, 3000, 10000, 50000, 100000, 500000, 1000000, 1000000];

    function createBar() {
      if (!data || data.length === 0) return;

      let color;
      // d3比例尺
      const scale = d3.scaleLinear<string>().domain(domain).range(d3.schemeSet3);

      data.forEach(({ lat, lng, value: size }) => {
        // 通过比例尺获取数据对应的颜色
        color = scale(size);
        const pos = convertLatLngToSphereCoords(Number(lat), Number(lng), globeRadius);
        if (pos.x && pos.y && pos.z) {
          // 我们使用立方体来生成柱状图
          const geometry = new THREE.BoxGeometry(2, 2, 1);
          // 移动立方体Z使其立在地球表面
          geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -0.5));
          const barMesh = new THREE.Mesh(
            geometry,
            new THREE.MeshBasicMaterial({
              color,
            }),
          );
          // 设置位置
          barMesh.position.set(pos.x, pos.y, pos.z);
          // 设置朝向
          barMesh.lookAt(earthMesh.position);
          // 根据数据设置柱的长度, 除20000主了为了防止柱体过长，可以根据实际情况调整，或做成参数
          barMesh.scale.z = Math.max(size / 20000, 0.1);
          barMesh.updateMatrix();
          meshGroup.add(barMesh);
        }
      });
    }

    // 创建webgl渲染器
    glRender = new THREE.WebGLRenderer({ canvas, alpha: true });
    glRender.setSize(canvas.clientWidth, canvas.clientHeight, false);
    // 创建场景
    scene = new THREE.Scene();

    // 创建相机
    const fov = 45;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const near = 1;
    const far = 4000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 400;

    // 轨道控制器
    controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);

    // 创建容器
    meshGroup = new THREE.Group();

    scene.add(meshGroup);

    // 创建一个球体
    const geometry = new THREE.SphereGeometry(globeRadius, globeSegments, globeSegments);
    // 创建球体材质
    const material = new THREE.MeshBasicMaterial({
      transparent: true, // 设置是否透明
      opacity: 0.5, // 透明度
      color: 0x000000, // 颜色
    });

    earthMesh = new THREE.Mesh(geometry, material);
    meshGroup.add(earthMesh);

    createMapPoints();

    createBar();

    // 渲染场景
    screenRender();
  }, []);
  return (
    <div id="box" className="h-full w-full">
      <canvas id="canvas" className="h-full w-full" />
    </div>
  );
};

export default Index;
