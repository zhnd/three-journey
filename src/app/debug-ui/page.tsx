"use client";

import gsap from "gsap";
import GUI from "lil-gui";
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function Page() {
  /**
   * We need to be able to tweak and debug easily.
   * It concerns the developer, the designer and even the client.
   * It will help finding the perfect color, speed, quantity, etc.
   * We can create our own or we can use a library:
   * lil.gui: https://lil-gui.georgealways.com/
   */

  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);

  const draw = useCallback(() => {
    // sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    //  scene
    const scene = new THREE.Scene();

    // Objects
    const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
    camera.position.z = 3;
    camera.lookAt(mesh.position);
    scene.add(camera);

    // renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasElementRef.current ?? undefined,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.render(scene, camera);

    // controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // animation
    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      mesh.rotation.y = elapsedTime;
      renderer.render(scene, camera);

      window.requestAnimationFrame(tick);
    };

    tick();

    window.onresize = () => {
      // update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // update renderer
      renderer.setSize(sizes.width, sizes.height);
    };

    window.ondblclick = () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        return;
      }
      canvasElementRef.current?.requestFullscreen();
    };

    // debug gui
    const gui = new GUI();
    const guiObject = {
      spin: () => {
        gsap.to(mesh.rotation, {
          duration: 2,
          z: mesh.rotation.z + Math.PI * 2,
        });
      },
    };
    gui.add(mesh.position, "x").name("position x").min(-3).max(3).step(0.01);
    gui.add(mesh.position, "y").name("position y").min(-3).max(3).step(0.01);
    gui.add(mesh.position, "z").name("position z").min(-3).max(3).step(0.01);

    gui.add(mesh, "visible").name("mesh visible");
    gui.add(material, "wireframe").name("material wireframe");
    gui.addColor(material, "color").name("material color");

    gui.add(guiObject, "spin").name("spin");
  }, []);

  useEffect(() => {
    draw();
  }, [draw]);
  return <canvas ref={canvasElementRef} />;
}
