import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as THREE from 'three';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private particles: THREE.Points | undefined;

  constructor() { }

  ngOnInit(): void {
    this.createScene();
    this.createParticles();
    this.animate();
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

      this.renderer = new THREE.WebGLRenderer({ canvas });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  createParticles() {
    const particleCount = 1000;
    const particlesGeometry = new THREE.BufferGeometry();

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
    });

    const particlesPosition: Float32Array = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      particlesPosition[i] = (Math.random() - 0.5) * 10;
    }

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
      this.particles.rotation.y += 0.001;
      this.particles.rotation.x += 0.001;
    }
    this.renderer.render(this.scene, this.camera);
  };
}
