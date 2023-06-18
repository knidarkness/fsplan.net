import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay, useDisclosure
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useFormspark } from "@formspark/use-formspark";

export default function FeedbackForm() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const FORMSPARK_FORM_ID = "piLHoCAI";
  const [submit, submitting] = useFormspark({
    formId: FORMSPARK_FORM_ID
  });

  const [message, setMessage] = useState("");

  const onSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    await submit({ message });
    onClose();
  };
  return (
    <div style={{width: '100%', marginTop: '20px'}}>
      <Button width={"100%"} bg={"#efe5e5"} onClick={onOpen}>Leave Feedback</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent style={{ height: "400px" }}>
          <form onSubmit={onSubmit}>
            <ModalHeader>Feedback</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                      <textarea
                        style={{
                          display: "block",
                          width: "100%",
                          height: "250px",
                          border: "solid 1px grey",
                          resize: "none",
                          padding: ".3em"
                        }}

                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit" disabled={submitting}>
                Submit
              </Button>
              <Button onClick={onClose} variant="ghost">Close</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>);
}