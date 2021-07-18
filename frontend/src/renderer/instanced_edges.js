import * as THREE from "three";

export default class InstancedEdges {
  constructor() {
    const boxGeo = new THREE.BoxBufferGeometry(2, 2, 2);
    const edges = new THREE.EdgesGeometry(boxGeo);
    this.geometry = new THREE.InstancedBufferGeometry().copy(edges);
    this.material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      //   onBeforeCompile: (shader) => {
      //     // Reuse the most of line basic material
      //     shader.vertexShader = `
      //           attribute vec3 translation;
      //           attribute vec4 rotation;
      //           vec3 applyQuaternionToVector( vec4 q, vec3 v ){
      //             return v + 2.0 * cross( q.xyz, cross( q.xyz, v ) + q.w * v );
      //           }
      //         ${shader.vertexShader}
      //       `.replace(
      //       `#include <begin_vertex>`,
      //       `
      //         #include <begin_vertex>
      //         transformed = applyQuaternionToVector(rotation, transformed ) + translation;
      //         `
      //     );
      //     console.log(shader.vertexShader);
      //   },
    });
    this.update();
    this.lines = new THREE.LineSegments(
      this.geometry,
      new THREE.LineBasicMaterial()
    );
  }

  addTo(scene) {
    scene.add(this.lines);
  }

  update() {
    // const poses = this.generateRandomPoseArray(2);
    // this.updatePoses(poses);
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

  // expect array of {position: THREE.Vector3, rotation: THREE.Quaternion}
  updatePoses(poses) {
    const translation = new Float32Array(3 * poses.length);
    const rotation = new Float32Array(4 * poses.length);
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
    this.geometry.setAttribute(
      "vtrans",
      new THREE.InstancedBufferAttribute(translation, 3, false)
    );
    this.geometry.setAttribute(
      "vrot",
      new THREE.InstancedBufferAttribute(rotation, 4, false)
    );
  }
}
