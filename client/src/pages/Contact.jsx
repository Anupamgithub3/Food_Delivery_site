import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { Email, Phone, LocationOn, Send } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/reducers/SnackbarSlice";

const Container = styled.div`
  padding: 40px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
  background: ${({ theme }) => theme.bg};
  @media (max-width: 768px) {
    padding: 20px 12px;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  gap: 40px;
  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const ContactInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 32px;
  background: ${({ theme }) => theme.card};
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.text_secondary + 20};
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.text_secondary};
  line-height: 1.5;
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const IconWrapper = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.primary + 15};
  color: ${({ theme }) => theme.primary};
  border-radius: 12px;
  font-size: 24px;
`;

const InfoText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.span`
  font-size: 17px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
`;

const FormSection = styled.div`
  flex: 1.5;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 40px;
  background: ${({ theme }) => theme.card};
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid ${({ theme }) => theme.text_secondary + 20};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Contact = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      dispatch(
        openSnackbar({
          message: "Message sent successfully! We'll get back to you soon.",
          severity: "success",
        })
      );
      setFormData({ name: "", email: "", message: "" });
      setLoading(false);
    }, 1500);
  };

  return (
    <Container>
      <ContentWrapper>
        <ContactInfo>
          <div>
            <Title>Get in Touch</Title>
            <Subtitle>
              Have a question or feedback? We'd love to hear from you. Reach out
              to us through any of these channels.
            </Subtitle>
          </div>

          <InfoList>
            <InfoItem>
              <IconWrapper>
                <Email />
              </IconWrapper>
              <InfoText>
                <InfoLabel>Email Us</InfoLabel>
                <InfoValue>support@foodeli.com</InfoValue>
              </InfoText>
            </InfoItem>

            <InfoItem>
              <IconWrapper>
                <Phone />
              </IconWrapper>
              <InfoText>
                <InfoLabel>Call Us</InfoLabel>
                <InfoValue>+91 98765 43210</InfoValue>
              </InfoText>
            </InfoItem>

            <InfoItem>
              <IconWrapper>
                <LocationOn />
              </IconWrapper>
              <InfoText>
                <InfoLabel>Visit Us</InfoLabel>
                <InfoValue>
                  123 Food Street, Delicious Avenue,
                  <br />
                  Bangalore, Karnataka 560001
                </InfoValue>
              </InfoText>
            </InfoItem>
          </InfoList>
        </ContactInfo>

        <FormSection>
          <Title>Send a Message</Title>
          <Form>
            <TextInput
              label="Full Name"
              placeholder="Enter your full name"
              name="name"
              value={formData.name}
              handelChange={handleChange}
            />
            <TextInput
              label="Email Address"
              placeholder="Enter your email address"
              name="email"
              value={formData.email}
              handelChange={handleChange}
            />
            <TextInput
              label="Message"
              placeholder="What's on your mind?"
              name="message"
              textArea
              rows={5}
              value={formData.message}
              handelChange={handleChange}
            />
            <Button
              text="Send Message"
              leftIcon={<Send />}
              isLoading={loading}
              isDisabled={!formData.name || !formData.email || !formData.message}
              onClick={handleSubmit}
            />
          </Form>
        </FormSection>
      </ContentWrapper>
    </Container>
  );
};

export default Contact;
