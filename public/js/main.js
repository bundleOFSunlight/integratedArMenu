import { createChromaMaterial } from './chroma-video.js';

const THREE = window.MINDAR.IMAGE.THREE;

window.addEventListener('load', async () => {
    //function to fetch videos and create a div of the video elements 
    const mind_file = await cloudinaryfetch();
    // pre-load videos by getting the DOM elements
    const loadedVideos = document.querySelectorAll(".chroma-vid");
    for (const vid of loadedVideos) {
        await vid.load();
    }
    //button will appear upon load 
    const startButton = document.getElementById('ready');
    startButton.style.visibility = "visible";
    const hide_card = document.getElementById('hiddingCard');
    hide_card.addEventListener('click', async function loadedPlanes() {
        hideDiv();
        startButton.style.display = "none"; //button will disappear upon click
        await start_ar(loadedVideos, mind_file);
        await loadFirstVideo(loadedVideos)
        document.body.removeEventListener("click", loadedPlanes, false);
    })
});

//helper functions

async function cloudinaryfetch() {
    // const key = `007d1d8e-425f-474d-a8a0-7235cad917c6`
    // const key = lookUpKey;
    // const baseUrl = "https://mind-ar-cms-dev.ap-southeast-1.elasticbeanstalk.com"
    // const result = await axios.get(`${baseUrl}/file_management/public/file_obj/${key}`);
    // const myObject = result.data.data.data;
    const myObject = [
        "https://res.cloudinary.com/dwuqadyl0/video/upload/v1657731459/mind_ar/uykd_lengzaab_GS/c20c6510-1347-4bc4-a873-e9e08ede5180.mp4",
        "https://res.cloudinary.com/dwuqadyl0/video/upload/v1657731494/mind_ar/uykd_massaman_gS/e0ee5799-19a8-4e50-930f-f9a245e319cb.mov",
        "https://res.cloudinary.com/dwuqadyl0/video/upload/v1657731521/mind_ar/somtam_vibrant%20%281%29/4eb42e27-8f9f-4076-8ac1-2793ec6fd0a5.mp4",
    ]
    await createVideoDivision(myObject);
    // return result.data.data.mind_file
    return "https://res.cloudinary.com/dwuqadyl0/raw/upload/v1657735641/mind_ar/targets%20%284%29/168ab87b-5764-4d25-b318-412822af971b"
}

//helper function which creates one division consisting of multiple video elements
//using the URLs fetched from API
async function createVideoDivision(reviewObject) {
    const currentDiv = document.getElementById("my-ar-container");
    const newDiv = document.createElement("div");
    newDiv.setAttribute("id", "newdiv");
    for (const value of reviewObject) {
        const video = await createVideoElement(value);
        newDiv.appendChild(video);
    }
    document.body.insertBefore(newDiv, currentDiv);
}

///helper function which returns a video Element 
async function createVideoElement(videoUrl) {
    const video = document.createElement("video");
    if (video.canPlayType("video/mp4")) {
        video.setAttribute('src', videoUrl);
        video.setAttribute('preload', 'auto');
        video.setAttribute('crossorigin', 'anonymous');
        video.setAttribute('webkit-playsinline', 'webkit-playsinline');
        //video.setAttribute('playsinline', 'playsinline');
        video.setAttribute('loop', 'true');
        video.setAttribute('style', 'display: none; ');
        video.setAttribute('class', 'chroma-vid');
        video.setAttribute('type', 'video/mp4');
        video.muted = true;
        video.playsInline = true;
    }
    return video;
}

async function loadFirstVideo(loadedChromaVids) {
    const play_tap = document.getElementById('my-ar-container');
    play_tap.addEventListener('click', async () => {
        for (const video of loadedChromaVids) {
            video.play()
        }
    })
}


async function start_ar(loadedChromaVids, mind_file) {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
        container: document.querySelector("#my-ar-container"),
        imageTargetSrc: mind_file,

    });
    const { renderer, scene, camera } = mindarThree;

    const anchors = new Array();
    for (let i = 0; i < loadedChromaVids.length; i++) {

        anchors.push(mindarThree.addAnchor(i));
        const GSvideo = loadedChromaVids[i];;
        const GSplane = createGSplane(GSvideo, 1, 3 / 4);

        if (i < anchors.length) {

            const anchor = anchors[i];
            anchor.group.add(GSplane);

            // when matched case
            anchor.onTargetFound = () => {
                GSvideo.play();
            }
            anchor.onTargetLost = () => {
                GSvideo.pause();
            }
        }
    }
    await mindarThree.start();
    await renderer.setAnimationLoop(async () => {
        await renderer.render(scene, camera);
    });
}


function createGSplane(GSvideo) {
    const GStexture = new THREE.VideoTexture(GSvideo);
    const GSgeometry = new THREE.PlaneGeometry(1, 1080 / 1920);
    const GSmaterial = createChromaMaterial(GStexture, 0x00ff38);
    const GSplane = new THREE.Mesh(GSgeometry, GSmaterial);
    GSplane.scale.multiplyScalar(2);
    //GSplane.position.z = 0.05;
    GSplane.rotation.z = Math.PI / 2;
    //GSplane.position.x = -0.2;
    return GSplane
}

function hideDiv() {
    const div_list = document.getElementById("welcome");
    div_list.style.display = "none";
}