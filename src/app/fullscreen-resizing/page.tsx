"use client";

import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function Page() {
  /**
   * make canvas fit in the viewport
   * to get the viewport width and height, use window.innerWidth and window.innerHeight
   */
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);

  const draw = useCallback(() => {
    const sizes = {
      // To get the viewport width and height, use window.innerWidth and window.innerHeight
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // scene
    const scene = new THREE.Scene();

    // Objects
    const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
    camera.position.set(2, 2, 2);
    camera.lookAt(mesh.position);
    scene.add(camera);

    // renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasElementRef.current ?? undefined,
    });
    renderer.setSize(sizes.width, sizes.height);

    /**
     * handle pixel ratio
     * Some might see a blurry render and stairs effect on the edges of the cube.
     * If so, it's because the pixel ratio of the canvas doesn't match the pixel ratio of the device.
     * The pixel radio corresponds to the ratio between the physical pixels of the device and the logical pixels used by the canvas.
     * To fix this, we need to set the pixel ratio of the renderer to the minimum between the device pixel ratio and 2.
     * This ensures that the renderer is of high quality and resolution on retina screens. while also avoiding performance issues that may arise from setting the pixel ratio to a higher value.
     */
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);

    renderer.render(scene, camera);

    // controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // animation
    const clock = new THREE.Clock();

    const tick = () => {
      controls.update();

      const elapsedTime = clock.getElapsedTime();
      mesh.rotation.y = elapsedTime;
      renderer.render(scene, camera);

      window.requestAnimationFrame(tick);
    };
    tick();

    // resize
    window.onresize = () => {
      // update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // update camera
      camera.aspect = sizes.width / sizes.height;
      // when we change the aspect ratio, we need to call the updateProjectionMatrix method
      camera.updateProjectionMatrix();

      // update renderer with setSize
      renderer.setSize(sizes.width, sizes.height);

      //  also do it on the resize event in case the user changes the window from a screen to another
      renderer.setPixelRatio(pixelRatio);
    };

    // fullscreen
    window.ondblclick = () => {
      if (document.fullscreenElement) {
        return document.exitFullscreen();
      }
      canvasElementRef.current?.requestFullscreen();
    };
  }, []);

  useEffect(() => {
    draw();
  }, [draw]);

  return <canvas ref={canvasElementRef} />;
}
