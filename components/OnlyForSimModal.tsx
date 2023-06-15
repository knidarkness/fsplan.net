import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure
} from "@chakra-ui/react";

export default function OnlyForSimModal () {
    const { isOpen, onClose } = useDisclosure({defaultIsOpen: true});
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>For Flight Sim Only</ModalHeader>
                <ModalBody>
                    All data provided on this site is for flight simulation use only.
                    <br/>
                    <br/>
                    <b>Not for real world navigation</b>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
