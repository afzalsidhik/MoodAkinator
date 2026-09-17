import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { MoodMeta } from '../../types';

interface MoodOrbCanvasProps {
  mood?: MoodMeta | null;
  interactive?: boolean;
  size?: 'hero' | 'medium' | 'small';
  className?: string;
}

export const MoodOrbCanvas: React.FC<MoodOrbCanvasProps> = ({
  mood,
  interactive = true,
  size = 'hero',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    // Scene setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = size === 'hero' ? 6 : size === 'medium' ? 5 : 4.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Group for mouse rotation
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Color computation
    const primaryHex = mood?.primaryColor || '#00f2fe';
    const secondaryHex = mood?.secondaryColor || '#7928ca';
    const baseColor = new THREE.Color(primaryHex);
    const secondaryColor = new THREE.Color(secondaryHex);

    // 1. Inner Glowing Nucleus Sphere
    const innerGeo = new THREE.SphereGeometry(size === 'hero' ? 1.4 : 1.0, 32, 32);
    const innerMat = new THREE.MeshStandardMaterial({
      color: baseColor,
      emissive: baseColor,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: false,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerMesh);

    // 2. Outer Geometric Cage / Neural Lattice (Icosahedron)
    const cageGeo = new THREE.IcosahedronGeometry(size === 'hero' ? 1.85 : 1.35, 2);
    const cageMat = new THREE.MeshStandardMaterial({
      color: secondaryColor,
      emissive: secondaryColor,
      emissiveIntensity: 0.4,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    mainGroup.add(cageMesh);

    // 3. Orbiting Rings (Neural Gyroscope)
    const ringGeo1 = new THREE.TorusGeometry(size === 'hero' ? 2.2 : 1.6, 0.02, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: baseColor,
      transparent: true,
      opacity: 0.6,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    mainGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(size === 'hero' ? 2.4 : 1.75, 0.015, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: secondaryColor,
      transparent: true,
      opacity: 0.4,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    mainGroup.add(ring2);

    // 4. Floating Ambient Particle Cloud
    const particleCount = size === 'hero' ? 180 : 80;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 2.4 + Math.random() * 2.2;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      scales[i] = Math.random() * 0.04 + 0.02;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: baseColor,
      size: 0.06,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particleSystem);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(primaryHex, 3, 50);
    pointLight1.position.set(3, 4, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(secondaryHex, 2.5, 50);
    pointLight2.position.set(-4, -3, 3);
    scene.add(pointLight2);

    // Mouse movement listener
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const { innerWidth, innerHeight } = window;
      mouseRef.current.targetX = (e.clientX / innerWidth - 0.5) * 1.5;
      mouseRef.current.targetY = (e.clientY / innerHeight - 0.5) * 1.5;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Resize handling
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      mainGroup.rotation.y = elapsedTime * 0.25 + mouseRef.current.x * 0.5;
      mainGroup.rotation.x = Math.sin(elapsedTime * 0.2) * 0.15 + mouseRef.current.y * 0.5;

      // Core pulsating breathing rhythm
      const pulse = 1 + Math.sin(elapsedTime * 1.8) * 0.06;
      innerMesh.scale.set(pulse, pulse, pulse);

      cageMesh.rotation.x = -elapsedTime * 0.15;
      cageMesh.rotation.y = -elapsedTime * 0.2;

      ring1.rotation.z = elapsedTime * 0.3;
      ring2.rotation.x = -elapsedTime * 0.25;

      particleSystem.rotation.y = elapsedTime * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [mood, interactive, size]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden pointer-events-none select-none ${className}`}
    />
  );
};
