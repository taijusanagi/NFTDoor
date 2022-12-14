import { Box, Button, Fade, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { MdReplay } from "react-icons/md";
import * as THREE from "three";

import { sleep } from "../../../lib/utils/sleep";

export interface ModelProps {
  image: string;
  effectVideo: string;
  delayTime: number;
  size?: number;
  isReplayable?: boolean;
}

export const Viewer: React.FC<ModelProps> = ({ image, effectVideo, delayTime, size = 240, isReplayable }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const canvasRef = React.useRef(null);
  const vidRef = React.useRef<any>();

  const scene = React.useMemo(() => {
    return new THREE.Scene();
  }, []);

  React.useEffect(() => {
    sleep(delayTime).then(() => {
      onOpen();
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      const sizes = {
        width: size,
        height: size,
      };
      const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas || undefined,
        antialias: true,
        alpha: true,
      });

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(window.devicePixelRatio);

      const boxGeometry = new THREE.BoxGeometry(3, 3, 0.0001);

      const boxTexture = new THREE.TextureLoader().load(image);

      const boxMaterial = new THREE.MeshBasicMaterial({
        map: boxTexture,
      });

      const box = new THREE.Mesh(boxGeometry, boxMaterial);
      box.position.z = -5;
      box.rotation.set(0, 0, 0);
      scene.add(box);

      // TODO: have exported
      const clock = new THREE.Clock();
      const tick = () => {
        const elapsedTime = clock.getElapsedTime();
        // box.rotation.x = elapsedTime;
        box.rotation.y = elapsedTime;
        window.requestAnimationFrame(tick);
        renderer.render(scene, camera);
      };
      tick();
    });
  }, [onOpen, delayTime, image, scene, size]);

  React.useEffect(() => {
    vidRef.current?.play();
  }, []);

  const replay = async () => {
    vidRef.current.currentTime = 0;
    vidRef.current.play();
    onClose();
    await sleep(delayTime);
    onOpen();
  };

  return (
    <Box position="relative" w={size} h={size}>
      <Box as="video" position="absolute" w={size} h={size} autoPlay muted ref={vidRef} objectFit="fill">
        <source type="video/mp4" src={effectVideo}></source>
      </Box>
      <Fade in={isOpen}>
        <Box as="canvas" ref={canvasRef} position="absolute" zIndex="100" w={size} h={size} />
      </Fade>
      {isReplayable && (
        <Button right="0" position="absolute" zIndex={"100"} m="1" fontSize="xs" size="xs" onClick={replay}>
          <MdReplay />
        </Button>
      )}
    </Box>
  );
};
