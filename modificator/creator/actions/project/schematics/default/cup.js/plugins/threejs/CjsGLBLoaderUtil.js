class CjsGLBElement {
    /**
     *
     * @param {THREE.Scene} scene
     * @param {THREE.Camera} camera
     * @param {THREE.WebGLRenderer} renderer
     * @param {THREE.OrbitControls} controls
     * @param {GLTFLoader} loader
     * @param {THREE.Scene} model
     */
    constructor(scene, camera, renderer, controls, loader, model) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.controls = controls;
        this.loader = loader;
        this.model = model;
    }

    /**
     *
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @param {Number} rotateX in degrees
     * @param {Number} rotateY in degrees
     * @param {Number} rotateZ in degrees
     * @param {Number} speed Interval speed per tick in milliseconds
     * @param {Number} positionDiff Value to add / subtract per tick from position RECOMMENDED TO BE SET FROM RANGE (0; 1)
     * @param {Number} rotationDiff Value to add / subtract per tick from rotation RECOMMENDED TO BE SET FROM RANGE (0; 1) in degrees
     */
    moveSmoothly(x, y, z, rotateX, rotateY, rotateZ, speed, positionDiff = 0.05, rotationDiff = 0.05) {
        function toRadians(degrees) {
            return degrees * (Math.PI / 180);
        }

        function toDegrees(radians) {
            return radians * (180 / Math.PI);
        }


        if(this.camera.enabled) {
            return console.warn("Cannot execute moveSmoothly method, because of 'camera.enabled' option is set to true")
        }

        const destination = {
            position: { x: x, y: y, z: z },
            rotation: { x: toRadians(rotateX), y: toRadians(rotateY), z: toRadians(rotateZ) }
        }
        const camPosition = this.camera.position;
        const camRotation = this.camera.rotation;

        const position = {
            x: { add: (x > camPosition.x), },
            y: { add: (y > camPosition.y), },
            z: { add: (z > camPosition.z), }
        }

        const rotation = {
            x: { add: (rotateX > camRotation.x), },
            y: { add: (rotateY > camRotation.y), },
            z: { add: (rotateZ > camRotation.z), }
        }

        const interval = setInterval(() => {
            /* Updated position and rotation variables for camera */
            const cPosition = this.camera.position;
            const cRotation = this.camera.rotation;

            const rules = {
                position: { x: false, y: false, z: false },
                rotation: { x: false, y: false, z: false }
            }

            for(const [key, value] of Object.entries(position)) {
                if(parseInt(cPosition[key]) !== parseInt(destination.position[key])) {
                    this.camera.position[key] += (position[key].add ? 1 : -1) * positionDiff
                } else {
                    //console.log(`Position rule for ${key} has been set to TRUE`)
                    rules.position[key] = true;
                }
            }

            for(const [key, value] of Object.entries(rotation)) {
                if(parseInt(cRotation[key]) !== parseInt(destination.rotation[key])) {
                    this.camera.rotation[key] += (rotation[key].add ? 1 : -1) * toRadians(rotationDiff)
                } else {
                    //console.log(`Rotation rule for ${key} has been set to TRUE`)
                    rules.rotation[key] = true;
                }
            }

            if(
                rules.position.x && rules.position.y && rules.position.z &&
                rules.rotation.x && rules.rotation.y && rules.rotation.z
            ) {
                clearInterval(interval);
                console.log('Interval CLEARED')
                //console.log(cPosition);
                //console.log(cRotation);
            }
        }, speed);
    }
}

class CjsGLBLoader {
    /**
     *
     * @param {String} url
     */
    constructor(url) {
        this.url = url;
        this.background = {
            color: 0xffffff,
            alpha: 0
        }
        this.fov = 75;
        this.near = 0.1;
        this.far = 6000;
        this.width = 500;
        this.height = 250;
        this.scale = 10;
        this.controlsEnabled = false;
        this.onProgressCallback = function() {}
        this.onErrorCallback = function() {}
    }

    /**
     *
     * @param {{color?: number, alpha?: number}} background
     * @returns {CjsGLBLoader}
     */
    setBackground(background) {
        if(!("color" in background)) { background.color = 0xffffff; }
        if(!("alpha" in background)) { background.alpha = 0; }

        this.background = background;

        return this;
    }

    setFov(fov) {
        this.fov = fov;

        return this;
    }

    setNear(near) {
        this.near = near;

        return this;
    }

    setFar(far) {
        this.far = far;

        return this;
    }

    setWidth(width) {
        this.width = width;

        return this;
    }

    setHeight(height) {
        this.height = height;

        return this;
    }

    setScale(scale) {
        this.scale = scale;

        return this;
    }

    setControlsEnabled(areEnabled) {
        this.controlsEnabled = areEnabled;

        return this;
    }

    /**
     *
     * @param {function(loaded: number, total: number)} callback
     * @return {CjsGLBLoader}
     */
    onProgress(callback) {
        this.onProgressCallback = callback;

        return this;
    }

    onError(callback) {
        this.onErrorCallback = callback;

        return this;
    }

    /**
     *
     * @return {Promise<CjsGLBElement>}
     */
    async getGLBElement() {
        return await new Promise((resolve => {
            const width = this.width;
            const height = this.height;
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera( this.fov, width / height, this.near, this.far );

            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

            /* Renderer shadow options (and light) */
            renderer.setClearColor( this.background.color, this.background.alpha );
            renderer.setSize(width, height);
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1;
            renderer.shadowMap.enabled = true;
            renderer.gammaFactor = 0;
            renderer.shadowMap.enabled = true

            const controls = new THREE.OrbitControls( camera, renderer.domElement );

            controls.enabled = this.controlsEnabled;

            controls.update()

            const animate = () => {
                requestAnimationFrame( animate );

                renderer.render( scene, camera );

                controls.update();
            }

            const loader = new THREE.GLTFLoader();

            loader.load(
                this.url,
                ( gltf ) => {
                    gltf.scene.scale.set(this.scale, this.scale, this.scale);
                    scene.add(new THREE.AmbientLight());

                    controls.update();

                    const lights = [
                        { x: 50, y: 50, z: 50 },
                        { x: -50, y: 50, z: 50 },
                        { x: -50, y: -50, z: 50 },
                        { x: -50, y: -50, z: -50 },
                        { x: 50, y: -50, z: -50 },
                        { x: 50, y: 75, z: -50 },
                        { x: 50, y: -50, z: 50 },
                    ];

                    lights.forEach(light => {
                        const pointLight = new THREE.PointLight('gray', 1.5, -10);
                        pointLight.position.set( (light.x / 100) * this.scale, (light.y / 100) * this.scale, (light.z / 100) * this.scale );

                        scene.add(pointLight);
                    })

                    const model = gltf.scene;

                    scene.add( model );
                    animate();

                    resolve(new CjsGLBElement(scene, camera, renderer, controls, loader, model));
                },
                this.onProgressCallback,
                this.onErrorCallback
            )
        }))
    }
}