"use client";

import useParentElementMeasure from "@/hooks/useParentElementMeasure";
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function Page() {
  /**
   * camera
   * camera is an abstract class
   * you are not supposed to use it directly
   * 1. array camera render the scene from multiple cameras on specific areas of the render
   * 2. stereo camera render the scene through two cameras that mimic the eyes to create a parallax effect, use with devices like VR headsets, red and blue glasses, etc.
   * 3. cube camera do 6 renders, each one facing a different direction, can render the surrounding for things like environment map, reflections or shadow map.
   * 4. orthographic camera render the scene without perspective, useful for 2D games or 2D elements like UI
   * 5. perspective camera render the scene with perspective, useful for 3D games or 3D elements like 3D models
   */

  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const { rect } = useParentElementMeasure(canvasElementRef);

  const draw = useCallback(() => {
    // scene
    const scene = new THREE.Scene();

    // Objects
    const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // camera
    // const camera = new THREE.PerspectiveCamera(75, rect.width / rect.height);

    /**
     * OrthographicCamera
     * OrthographicCamera differs from PerspectiveCamera by it's lack of perspective.
     * Objects has the same size regardless of their distance from the camera.
     * instead of a field of view, we provide how far the camera can see in each direction.
     * @param left
     * @param right
     * @param top
     * @param bottom
     * @param near
     * @param far
     */
    const camera = new THREE.PerspectiveCamera(75, rect.width / rect.height);

    // the cube looks flat, it's because we are rendering a square area into a rectangle canvas,
    // We need to use the canvas radio(width by height)
    // const aspectRatio = rect.width / rect.height;
    // const camera = new THREE.OrthographicCamera(
    //   -1 * aspectRatio,
    //   1 * aspectRatio,
    //   1,
    //   -1,
    //   0.1,
    //   100
    // );
    camera.position.set(2, 2, 2);
    camera.lookAt(mesh.position);
    scene.add(camera);

    // renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasElementRef.current ?? undefined,
    });
    renderer.setSize(rect.width, rect.height);
    renderer.render(scene, camera);

    // controls
    const controls = new OrbitControls(camera, renderer.domElement);
    // The damping will smooth the animation by adding some kind of acceleration and friction.
    // To enable the damping, switch the enableDamping property to true.
    controls.enableDamping = true;

    // animation
    const clock = new THREE.Clock();

    const tick = () => {
      // The result might be strange because we need to update it on each frame.Call controls.update() in the animation loop.
      controls.update();

      const elapsedTime = clock.getElapsedTime();
      mesh.rotation.y = elapsedTime;
      renderer.render(scene, camera);

      window.requestAnimationFrame(tick);
    };
    tick();
  }, [rect]);

  useEffect(() => {
    draw();
  }, [draw]);

  return <canvas ref={canvasElementRef} />;
}
