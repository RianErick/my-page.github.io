import {Component, OnInit} from '@angular/core';
import {NgxTimelineModule,} from '@frxjs/ngx-timeline';
import * as THREE from 'three';
import {PointsMaterialParameters} from 'three';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxTimelineModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private particles: THREE.Points | undefined;


  constructor() {
  }

  ngOnInit(): void {
    this.createScene();
    this.createParticles();
    this.animate();
  }

  pointsMaterialParameters: PointsMaterialParameters = {
    color: 0xffffff,
    size: 0.02,
    opacity: 1000,
  }

  createScene() {
    const canvas: HTMLElement | null = document.getElementById('canvas');
    if (canvas != null) {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

      this.camera.position.z = 6;
      this.camera.position.x = 0;

      this.renderer = new THREE.WebGLRenderer({canvas});
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  rotationParticles(particleCount: number , particlesPosition: Float32Array) {
    const radius = 3
    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(2 * Math.random() - 1); // Ângulo azimutal
      const theta = Math.random() * 2 * Math.PI; // Ângulo polar

      // Convertendo coordenadas esféricas para cartesianas
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      particlesPosition[i * 3] = x;
      particlesPosition[i * 3 + 1] = y;
      particlesPosition[i * 3 + 2] = z;
    }

  }

  createParticles() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesMaterial = new THREE.PointsMaterial(this.pointsMaterialParameters);
    const particlesPosition: Float32Array = new Float32Array(1000 * 3);

    this.rotationParticles(1000, particlesPosition)

    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(particlesPosition, 3)
    );

    this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
    this.scene.add(this.particles);
  }

  animate = () => {
    requestAnimationFrame(this.animate);

    if (this.particles) {
      this.particles.rotation.x += 0.001;
      this.particles.rotation.y += 0.001;
      this.particles.rotation.z += 0.001;
    }

    this.renderer.render(this.scene, this.camera);
  };
}
