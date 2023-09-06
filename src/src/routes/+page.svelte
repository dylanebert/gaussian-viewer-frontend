<script>
    // @ts-nocheck

    import { onMount, onDestroy } from "svelte";

    const radius = 3;

    let pc;
    let dc;
    let throttleTimeout;

    let isLoading = true;
    let isDragging = false;
    let xDeg = 30;
    let yDeg = 45;
    let offset = [0, 0.5, 0];
    let lastTouchX = 0;
    let lastTouchY = 0;

    onMount(async () => {
        // WebRTC setup
        const sessionID = Math.random().toString(36).substring(2, 15);
        await connectToPeer(sessionID);

        // Camera input setup
        const main = document.querySelector("main");
        main.addEventListener("mousedown", () => (isDragging = true));
        main.addEventListener("mouseup", () => (isDragging = false));
        main.addEventListener("mousemove", handleMouseMove);
        main.addEventListener("touchstart", handleTouchStart);
        main.addEventListener("touchmove", handleTouchMove);
        main.addEventListener("touchend", () => (isDragging = false));

        isLoading = false;
    });

    onDestroy(() => {
        if (pc) {
            pc.close();
        }
    });

    async function connectToPeer(sessionID) {
        const iceServers = await fetch(
            `https://viewer.dylanebert.com/ice-servers`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        ).then((response) => response.json());

        var config = {
            iceServers: iceServers,
        };

        console.log("Creating RTCPeerConnection with config: ", config);

        pc = new RTCPeerConnection(config);

        let iceCandidateBuffer = [];

        pc.onicecandidate = async ({ candidate }) => {
            if (candidate) {
                iceCandidateBuffer.push(candidate);
            }
        };

        pc.ontrack = (event) => {
            console.log("Received track:", event);
            document.getElementById("player").srcObject = event.streams[0];
        };

        dc = pc.createDataChannel("camera");

        const offerOptions = {
            offerToReceiveAudio: false,
            offerToReceiveVideo: true,
        };

        const offer = await pc.createOffer(offerOptions);
        console.log("Created offer:", offer);

        await pc.setLocalDescription(offer);

        isLoading = false;

        console.log("Sending offer SDP: ", offer);

        const answer = await fetch(
            `https://viewer.dylanebert.com/offer?session_id=${sessionID}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sdp: pc.localDescription.sdp,
                    type: pc.localDescription.type,
                }),
            }
        ).then((response) => response.json());

        console.log("Received answer SDP: ", answer);
        await pc.setRemoteDescription(answer);

        iceCandidateBuffer.forEach(async (candidate) => {
            await sendIceCandidate(candidate, sessionID);
        });
    }

    async function sendIceCandidate(candidate, sessionID) {
        const json = JSON.stringify(candidate);
        console.log("Sending ICE candidate: ", json);
        await fetch(
            `https://viewer.dylanebert.com/ice-candidate?session_id=${sessionID}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: json,
            }
        );
    }

    function throttle(func, delay) {
        if (throttleTimeout) {
            return;
        }
        throttleTimeout = setTimeout(() => {
            func();
            throttleTimeout = null;
        }, delay);
    }

    function handleTouchStart(event) {
        isDragging = true;
        const touch = event.touches[0];
        lastTouchX = touch.clientX;
        lastTouchY = touch.clientY;
    }

    function handleTouchMove(event) {
        if (!isDragging) return;
        const touch = event.touches[0];
        const moveX = touch.clientX - lastTouchX;
        const moveY = touch.clientY - lastTouchY;

        lastTouchX = touch.clientX;
        lastTouchY = touch.clientY;

        updateCamera(moveX, moveY);
    }

    function handleMouseMove(event) {
        if (!isDragging) return;
        const moveX =
            event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        const moveY =
            event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        updateCamera(moveX, moveY);
    }

    function updateCamera(moveX, moveY) {
        yDeg -= moveX * 0.5;
        xDeg += moveY * 0.5;

        xDeg = Math.min(Math.max(xDeg, 0), 70);
        yDeg = (yDeg + 360) % 360;

        const position = computePosition(xDeg, yDeg);
        const rotation = [-xDeg, 270 - yDeg, 0];

        throttle(() => {
            sendCameraInfoToBackend(position, rotation);
        }, 1000 / 30);
    }

    function computePosition(xDeg, yDeg) {
        const theta = (xDeg * Math.PI) / 180;
        const phi = (yDeg * Math.PI) / 180;

        const position = [
            radius * Math.cos(phi) * Math.cos(theta) + offset[0],
            -radius * Math.sin(theta) + offset[1],
            radius * Math.sin(phi) * Math.cos(theta) + offset[2],
        ];

        return position;
    }

    function sendCameraInfoToBackend(position, rotation) {
        const payload = {
            type: "camera_update",
            position,
            rotation,
        };
        dc.send(JSON.stringify(payload));
    }
</script>

<main>
    {#if isLoading}
        <div>Loading...</div>
    {:else}
        <video id="player" src="" autoplay muted controls playsinline />
    {/if}
</main>

<style>
    main {
        user-select: none;
        -webkit-user-drag: none;
        -moz-user-select: none;
        -ms-user-select: none;
        max-width: 1024px;
        width: 100%;
        display: block;
        margin: 0 auto;
    }

    #player {
        pointer-events: none;
        width: 100%;
    }
</style>
