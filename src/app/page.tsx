import { Confidentiality } from "@/components/confidentiality/confidentiality";
import { Contact } from "@/components/contact/contact";
import { DeliveryModels } from "@/components/delivery-models";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero/hero";
import { Nav } from "@/components/nav";
import { Norms } from "@/components/norms";
import { Pipeline } from "@/components/pipeline/pipeline";
import { Platform } from "@/components/platform/platform";
import { Services } from "@/components/services/services";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="conteudo">
        <Hero />
        <Norms />
        <Services />
        <Pipeline />
        <DeliveryModels />
        <Confidentiality />
        <Platform />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
