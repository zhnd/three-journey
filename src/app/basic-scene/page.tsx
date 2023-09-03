"use client";
import useParentElementMeasure from "@/hooks/useParentElementMeasure";
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";

export default function Page() {
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const { rect } = useParentElementMeasure(canvasElementRef);

  const draw = useCallback(() => {
    /**
     * scene
     * like a container
     * we put objects, models, lights, etc. in it.
     * at some point we ask Three.js to render that scene
     */
    const scene = new THREE.Scene();

    /**
     * Objects
     * can be many things
     * primitive geometries
     * imported models
     * particles
     * lights
     * etc.
     */

    // start with a simple red cube

    /**
     * Mesh
     * combination of a geometry(the shape) and a material(how it looks)
     */

    // red cube

    // geometry
    const geometry = new THREE.BoxGeometry();

    // material
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    /**
     * Camera
     * not visible
     * serve as point of view when doing a render
     * can have multiple ans switch between them
     * different types
     */
    const camera = new THREE.PerspectiveCamera(75, rect.width / rect.height);
    scene.add(camera);

    // nothing visible because the camera is inside the cube
    // we need move the camera backward
    // to transform an object, we can use the following properties
    // the position property is else an object with x, y, z properties
    camera.position.z = 3;

    /**
     * Renderer
     * render the scene from the camera point of view
     * result draw info a canvas
     * a canvas is a html element in which you can draw stuff
     * Three.js will use WebGL to draw the render inside this canvas
     * you can create it or you can let Three.js do it
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasElementRef.current ?? undefined,
    });
    renderer.setSize(rect.width, rect.height);
    renderer.render(scene, camera);
  }, [rect]);

  useEffect(() => {
    draw();
  }, [draw]);

  return <canvas ref={canvasElementRef} />;
}
