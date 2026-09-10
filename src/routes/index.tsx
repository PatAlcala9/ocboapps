import { Column, Display, Image, Padding, Page, Row, Background } from "@dasig";
import Card from "components/Card";
import "./index.sass";

export default () => {
  return (
      <Page title="OCBO Apps">
        <Background image="new-background" />

        <Display desktop tablet>
          <div class="portal-texts-group">
            <Row gap={0.5} content="center">
              <Image name="ocbo-portal" size={90} />
              <span class="logo-text">OCBO Apps Portal</span>
            </Row>

            <Row content="center">
              <Column>
                <h1 class="portal-title">A Portal to OCBO Applications</h1>
              </Column>
            </Row>
          </div>

          <Row gap={2.5}>
            <Card
              image="logo"
              name="OCBO e-Sign"
              description="A secure way of signing permits"
              site="/esign"
            />
          </Row>
        </Display>

        <Display mobile>
          <Column gap={0.5} content="center">
            <Image name="ocbo-portal" size={120} />
            <span class="logo-text">OCBO Apps Portal</span>
          </Column>

          <Padding top={4} bottom={2} left={0} right={0}>
            <Column gap={1.5}>
              <Card
                image="logo"
                name="OCBO e-Sign"
                description="A secure way of signing permits"
                site="/esign"
              />
            </Column>
          </Padding>
        </Display>
      </Page>
  );
};
