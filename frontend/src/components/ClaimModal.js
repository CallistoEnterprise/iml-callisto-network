import { useContext } from "react";
import { Modal } from "@mui/material";
import { ModalContext } from "../contexts/ModalContextProvider";

const ClaimModal = () => {
  const { openClaimModal, setOpenClaimModal } = useContext(ModalContext);
	return (
		<Modal open={openClaimModal} onClose={() => setOpenClaimModal(false)}>
			<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[605.81px] border-none outline-none">
				<div className="flex flex-col items-start px-[36.52px] py-[70.06px] backdrop-blur-[6px] bg-claim rounded-xl">
					<span className="font-medium text-[34.6615px] leading-[43px]">Congratulations!</span>
					<span className="font-light text-[16.0403px] leading-[20px] max-w-[273px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi gravida.</span>
					<button className="flex justify-center items-center w-[155.56px] h-[32.36px] bg-green2 mt-[32.48px] rounded-sm font-light text-[12px] leading-[100%] tracking-[0.02em]">Claim Reward</button>
					<img className="absolute bottom-0 right-0" src="/images/shapes.png" alt='' />
				</div>
			</div>
		</Modal>
	)
}

export default ClaimModal;