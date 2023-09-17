"use client";

import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function Page() {
  /**
   * geometry
   * Composed of vertices(point coordinates in 3D spaces) and faces(triangles that join those vertices to create a surface)
   * can be used to create a mesh but also for particles
   * can store more data than the positions(UV coordinates, normals, colors, etc.)
   */

  /**
   * Before we creating the geometry, we need to understand how to store buffer geometry data.
   * We are going to use Float32Array.
   * Typed array
   * can only store floats
   * fixed length
   * Easier to handle for the computer
   */

  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);

  const draw = useCallback(() => {
    // sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // scene
    const scene = new THREE.Scene();

    // Objects
    // const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5);

    // It's a one dimension array where the first 3 values are the x, y, z coordinates of the first vertex
    // The next 3 values are the x, y, z coordinates of the second vertex, etc.

    /*
    const positionsArray = new Float32Array([
      // vertex 1
      0, 0, 0,
      // vertex 2
      0, 1, 0,
      // vertex 3
      1, 0, 0,
    ]);
    */

    // We can then convert that Float32Array into a BufferAttribute
    // 3 corresponds to how much values compose one vertex
    // const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);

    // We can add this BufferAttribute to a our BufferGeometry with setAttribute()
    const geometry = new THREE.BufferGeometry();
    // geometry.setAttribute("position", positionsAttribute);

    // We can also create a bunch of random triangles
    const count = 50;
    const positionsArray = new Float32Array(count * 3 * 3);

    for (let i = 0; i < count * 3 * 3; i += 1) {
      positionsArray[i] = (Math.random() - 0.5) * 2;
    }
    const anotherPositionsAttribute = new THREE.BufferAttribute(
      positionsArray,
      3
    );
    geometry.setAttribute("position", anotherPositionsAttribute);

    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true, // render the geometry as wireframe
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
    camera.position.z = 3;
    scene.add(camera);

    // renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasElementRef.current!,
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

      // update controls
      controls.update();

      // render
      renderer.render(scene, camera);

      // call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();

    window.onresize = () => {
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
