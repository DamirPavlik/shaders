const canvas = document.getElementById('webglCanvas');

/**
 * @param {HTMLCanvasElement} canvas
 */
function run(canvas) {
    const gl = canvas.getContext('webgl');
    if (!gl) {
        console.log("WebGL not supported");
        return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.39, 0.58, 0.93, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vertexShaderSource = `
        attribute vec2 aPosition;
        void main() {
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
    `;

    const fragmentShaderSource = `
        precision mediump float;
        uniform vec2 u_pos;
        uniform float u_window_diag;
        void main() {
            vec4 red = vec4(1.0, 0.0, 0.0, 1.0);
            float dist = distance(gl_FragCoord.xy, u_pos);
            red = red * (dist / u_window_diag);
            gl_FragColor = red;
        }
    `;

    function compileShader(source, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        return;
    }

    gl.useProgram(program);

    const vertices = new Float32Array([
        -1, -1,
        3, -1,
        -1, 3
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);

    const uPosLocation = gl.getUniformLocation(program, "u_pos");
    const uWindowDiag = gl.getUniformLocation(program, "u_window_diag");

    canvas.addEventListener("mousemove", (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = rect.bottom - event.clientY;
        gl.uniform2f(uPosLocation, mouseX, mouseY);
        
        const ww = rect.width * rect.width;
        const hh = rect.height * rect.height;
        gl.uniform1f(uWindowDiag, Math.sqrt(ww + hh));
    });

    function render() {
        gl.clearColor(0,0,0,1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(render);
    }
    render();
}

run(canvas);