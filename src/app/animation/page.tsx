"use client";
import useParentElementMeasure from "@/hooks/useParentElementMeasure";
import gsap from "gsap";
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";

export default function Page() {
  // one render is cool, an animation is better
  // let's animate the page
  /**
   * animating is like doing stop motion
   * move the object
   * take a picture
   * move the object a bit more
   * etc.
   * most screens run at 60fps, but not always, your animation must look the same regardless of the framerate
   * we need to update objects and do a render on each frame
   * we are going to do that in a function and call this function with requestAnimationFrame
   * The purpose if requestAnimationFrame is to call the function provided on the next frame
   * we are going to call the same function on each new frame
   */

  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const { rect } = useParentElementMeasure(canvasElementRef);

  const draw = useCallback(() => {
    // scene
    const scene = new THREE.Scene();

    // Objects
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // camera
    const camera = new THREE.PerspectiveCamera(75, rect.width / rect.height);
    camera.position.z = 3;
    scene.add(camera);

    // renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasElementRef.current ?? undefined,
    });
    renderer.setSize(rect.width, rect.height);
    renderer.render(scene, camera);

    // animation

    // animation with GSAP
    gsap.to(mesh.position, { duration: 1, delay: 1, x: 3 });
    gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 });

    /**
     * the higher the framerate, the faster the animation
     * we need to know how much time it's been since the last tick
     * use Date.now() to get the current timestamp
     * subtract the previous time to get the delta time, use the deltaTime in the animation
     */

    // let time = Date.now();

    /**
     * Clock
     * other solution is to use the clock class
     * Three.js has a build-in solution named Clock
     * instantiate a Clock and use it's getElapsedTime method
     */
    const clock = new THREE.Clock();
    const tick = () => {
      // const currentTime = Date.now();
      // const deltaTime = currentTime - time;
      // mesh.rotation.y += 0.001 * deltaTime;
      // time = currentTime;

      const elapsedTime = clock.getElapsedTime();

      // update objects
      camera.position.x = Math.cos(elapsedTime);
      camera.position.y = Math.sin(elapsedTime);
      camera.lookAt(mesh.position);

      // render
      renderer.render(scene, camera);

      // call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();
  }, [rect]);

  useEffect(() => {
    draw();
  }, [draw]);

  return <canvas ref={canvasElementRef} />;
}
