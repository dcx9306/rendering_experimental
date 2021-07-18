import * as THREE from "three";

import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";

export default class InstancedEdges {
  constructor() {
    const boxGeo = new THREE.BoxBufferGeometry(0.2, 0.2, 0.2);
    const edges = new THREE.EdgesGeometry(boxGeo);
    this.geometry = new THREE.InstancedBufferGeometry().copy(edges);
    this.material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      onBeforeCompile: (shader) => {
        // Reuse the most of line basic material
        shader.vertexShader = `
                attribute vec3 vtrans;
                attribute vec4 vrot;
                vec3 applyQuaternionToVector( vec4 q, vec3 v ){
                  return v + 2.0 * cross( q.xyz, cross( q.xyz, v ) + q.w * v );
                }
              ${shader.vertexShader}
            `.replace(
          `#include <begin_vertex>`,
          `#include <begin_vertex>
           transformed = applyQuaternionToVector(vrot, transformed ) + vtrans;`
        );
      },
    });
    this.data = this.generateRandomPoseArray(50000);
    this.checkMergeGeometryTime();
    this.update();
    this.geometry.instanceCount = Infinity;
    this.lines = new THREE.LineSegments(this.geometry, this.material);
  }

  addTo(scene) {
    scene.add(this.lines);
  }

  update() {
    this.data.push(this.data[0]);
    this.data.shift();
    // 50000 boxes 1ms
    // 500000 boxes 10ms
    const t2 = performance.now();
    this.updatePoses(this.data);
    const t3 = performance.now();
  }

  generateRandomPoseArray(count) {
    const res = [];
    for (let i = 0; i < count; ++i) {
      const euler = new THREE.Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        "XYZ"
      );
      const pose = {
        position: new THREE.Vector3(
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
          Math.random() * 2 - 1
        ),
        rotation: new THREE.Quaternion().setFromEuler(euler),
      };
      res.push(pose);
    }
    return res;
  }

  checkMergeGeometryTime() {
    const t1 = performance.now();
    const base = new THREE.BoxBufferGeometry(0.2, 0.2, 0.2);
    const geometryArr = [];
    for (const pose of this.data) {
      const newGeometry = base.clone();
      newGeometry.translate(pose.position.x, pose.position.y, pose.position.z);
      newGeometry.applyQuaternion(pose.rotation);
      geometryArr.push(newGeometry);
    }
    const next = BufferGeometryUtils.mergeBufferGeometries(geometryArr);
    const t2 = performance.now();
    console.log(`${next.name} merge takes ${t2 - t1}`);
    // Experiment result on 2080Ti 1600MHz + 9700K 4.5GHz:
    // 50000 boxes, 460ms
    // 500000 boxes, 6600 ms
  }

  // expect array of {position: THREE.Vector3, rotation: THREE.Quaternion}
  updatePoses(poses) {
    let translation = null;
    let rotation = null;
    if (this.geometry.getAttribute("vtrans")) {
      translation = this.geometry.getAttribute("vtrans").array;
    } else {
      translation = new Float32Array(3 * poses.length);
      this.geometry.setAttribute(
        "vtrans",
        new THREE.InstancedBufferAttribute(translation, 3)
      );
    }
    if (this.geometry.getAttribute("vrot")) {
      rotation = this.geometry.getAttribute("vrot").array;
    } else {
      rotation = new Float32Array(3 * poses.length);
      this.geometry.setAttribute(
        "vrot",
        new THREE.InstancedBufferAttribute(rotation, 3)
      );
    }
    let i = 0;
    let j = 0;
    for (const p of poses) {
      translation[i++] = p.position.x;
      translation[i++] = p.position.y;
      translation[i++] = p.position.z;
      rotation[j++] = p.rotation.x;
      rotation[j++] = p.rotation.y;
      rotation[j++] = p.rotation.z;
      rotation[j++] = p.rotation.w;
    }
  }
}
