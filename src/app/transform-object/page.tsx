"use client";
import useParentElementMeasure from "@/hooks/useParentElementMeasure";
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";

export default function Page() {
  /**
   * there are 4 properties to transform objects
   * position
   * scale
   * rotation
   * quaternion
   * those properties will be compiled in matrices, you don't need to understand matrices
   */

  // all classes that inherit from the Object3D possess those properties like PerspectiveCamera or Mesh

  /**
   * the direction of each axis is arbitrary, in Three.js, we consider:
   * x axis is going to the right
   * y axis is going upward
   * z axis is going to the background
   */

  /**
   * position inherit from Vector3, which has many useful methods
   * you can get the length of a vector
   * you can get the distance from another Vector3
   * example: mesh.position.distanceTo(camera.position)
   * you can normalize its values: mesh.position.normalize()
   */

  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const { rect } = useParentElementMeasure(canvasElementRef);

  const draw = useCallback(() => {
    // scene
    const scene = new THREE.Scene();
    /**
     * positioning things in space can be hard
     * one good solution is to use the AxesHelper to display a colored line for each axis
     */
    const axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);

    // objects

    /**
     * group
     * you can put objects inside groups and use position, rotation(or quaternion) and scale on the groups
     * to do that, use the Group class
     */

    const group = new THREE.Group();
    group.position.set(0, 1, 0);
    group.scale.set(1, 2, 1);
    group.rotation.set(0, 1, 0);
    scene.add(group);

    const cube_one = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
      })
    );
    cube_one.position.set(-2, 0, 0);
    group.add(cube_one);

    const cube_two = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshBasicMaterial({
        color: 0x00ff00,
      })
    );
    group.add(cube_two);

    const cube_three = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshBasicMaterial({
        color: 0x0000ff,
      })
    );
    cube_three.position.set(2, 0, 0);
    group.add(cube_three);

    // const geometry = new THREE.BoxGeometry();
    // const material = new THREE.MeshBasicMaterial({
    //   color: 0xff0000,
    // });
    // const mesh = new THREE.Mesh(geometry, material);
    // mesh.position.x = 0.8;
    // mesh.position.y = -0.7;
    // mesh.position.z = 0.6;
    // mesh.position.set(0.7, 0, 0.6);
    // mesh.position.normalize();
    // scene.add(mesh);

    /**
     * Scale
     * with scale which has 3 properties:x, y, z
     */
    // mesh.scale.x = 2;
    // mesh.translate.x = 2;
    // mesh.scale.z = 0.5;
    // mesh.scale.set(2, 0.5, 0.5);

    /**
     * rotate objects
     * with rotation or with quaternion
     * updating one will automatically update other
     */

    // Be careful, when you rotate on an axis, you might also rotate the other axis
    // The rotation goes by default in the x, y and z order and you can get strange result like an axis not working anymore, this is called gimbal lock
    //  you can change this order by using reorder method, do it before changing the rotation
    // mesh.rotation.reorder("XYZ");
    // mesh.rotation.x = Math.PI * 0.25;
    // mesh.rotation.y = Math.PI * 0.25;

    /**
     * Euler is easy to understand but this axis order can be problematic
     * this is why most engines and 3d softwares use quaternion
     * quaternion also expresses a rotation, but in a more mathematical way, we will not cover quaternions tin this lesson but remember that the quaternion updates when you changes to rotation.
     */

    // camera
    const camera = new THREE.PerspectiveCamera(75, rect.width / rect.height);
    camera.position.set(1, 1, 3);
    scene.add(camera);

    // Objects3D instances have a lookAt method which rotates the object so that its -z faces the target you provided
    // the target must be a Vector3
    // camera.lookAt(mesh.position);

    // renderer
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
