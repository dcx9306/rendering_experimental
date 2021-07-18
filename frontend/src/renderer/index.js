import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as THREE from "three";
import InstancedEdges from "./instanced_edges";

export default class Renderer {
  constructor(parentDomElement, store) {
    this.store = store;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    parentDomElement.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.instancedEdges = new InstancedEdges();
    this.instancedEdges.addTo(this.scene);
    // this.box = new THREE.Mesh(
    //   new THREE.BoxBufferGeometry(1.0, 1.0, 1.0),
    //   new THREE.MeshBasicMaterial()
    // );
    // this.scene.add(this.box);
    this.renderer.setAnimationLoop(() => {
      this.instancedEdges.update();
      const t1 = performance.now();
      this.renderer.render(this.scene, this.camera);
      this.renderer.getContext().finish();
      const t2 = performance.now();
      console.log(`render takes ${t2 - t1} ms`);
      this.store.rendererInfo.update(this.renderer.info);
    });
  }
}
