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
            gl_Position = vec4(aPosition, 0.0, 1.0)
        }
    `;

    const fragmentShaderSource = `
        precision mediump float;
        void main() {
            gl_FragColor = vec4(0.39, 0.58, 0.93, 1.0); // Cornflower blue
        }
    `;

    function compileShader(gl, type, source) {
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

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
}

run(canvas);