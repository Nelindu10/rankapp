import React, { useEffect, useRef } from 'react';

export const BackgroundShader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      varying vec2 v_texCoord;

      void main() {
        vec2 uv = v_texCoord;
        
        // Drifting nebula effect for competitive gaming background
        vec3 color1 = vec3(0.04, 0.04, 0.06); // Deep Obsidian
        vec3 color2 = vec3(0.12, 0.04, 0.22); // Dark Purple Glow
        vec3 color3 = vec3(0.03, 0.12, 0.18); // Deep Cyan Pulse
        
        float t1 = 0.5 + 0.5 * sin(u_time * 0.2 + uv.x * 2.5);
        float t2 = 0.5 + 0.5 * cos(u_time * 0.25 + uv.y * 2.5);
        
        vec3 finalColor = mix(color1, color2, t1 * 0.35);
        finalColor = mix(finalColor, color3, t2 * 0.35);
        
        // Subtle grid lines
        float grid = (step(0.985, fract(uv.x * 24.0)) + step(0.985, fract(uv.y * 24.0))) * 0.025;
        finalColor += grid;

        // Subtle cursor light reaction
        vec2 normMouse = u_mouse / u_resolution;
        float distToMouse = distance(uv, vec2(normMouse.x, 1.0 - normMouse.y));
        float mouseGlow = smoothstep(0.4, 0.0, distToMouse) * 0.08;
        finalColor += vec3(0.0, mouseGlow * 0.8, mouseGlow);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = createShader(gl.VERTEX_SHADER, vs);
    const fragShader = createShader(gl.FRAGMENT_SHADER, fs);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]), gl.STATIC_DRAW);

    const posLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLocation);
    gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0);

    const uTimeLocation = gl.getUniformLocation(program, 'u_time');
    const uResLocation = gl.getUniformLocation(program, 'u_resolution');
    const uMouseLocation = gl.getUniformLocation(program, 'u_mouse');

    let mousePos = { x: canvas.width / 2, y: canvas.height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        mousePos.x = e.clientX - rect.left;
        mousePos.y = e.clientY - rect.top;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const syncSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    syncSize();
    window.addEventListener('resize', syncSize);

    let animationFrameId: number;
    const render = (time: number) => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTimeLocation) gl.uniform1f(uTimeLocation, time * 0.001);
      if (uResLocation) gl.uniform2f(uResLocation, canvas.width, canvas.height);
      if (uMouseLocation) gl.uniform2f(uMouseLocation, mousePos.x, mousePos.y);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', syncSize);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full -z-10 opacity-50 pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
