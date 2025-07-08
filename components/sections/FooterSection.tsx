import Logo from "@/components/ui/Logo";
import FooterLinkList from "@/components/ui/FooterLinkList";
import Image from "next/image";

export default function FooterSection() {
  const productLinks = [
    { name: "Popular", href: "/popular" },
    { name: "Trending", href: "/trending" },
    { name: "Guided", href: "/guided" },
    { name: "Products", href: "/products" },
  ];

  const companyLinks = [
    { name: "Press", href: "/press" },
    { name: "Mission", href: "/mission" },
    { name: "Strategy", href: "/strategy" },
    { name: "About", href: "/about" },
  ];

  const infoLinks = [
    { name: "Support", href: "/support" },
    { name: "Customer Service", href: "/customer-service" },
    { name: "Get started", href: "/get-started" },
  ];

  const socialIcons = [
    { src: "/icons/logo-fb-simple 1.svg", alt: "Facebook" },
    { src: "/icons/twitter.svg", alt: "Twitter" },
    { src: "/icons/google.svg", alt: "Google" },
  ];

  return (
    <footer className="w-full bg-(--color-grandfather-lightest) p-8 lg:px-[138px] lg:py-16">
      <div className="mx-auto max-w-[1164px]">
        {/* Main Footer Content */}
        <div className="flex flex-col items-center justify-between gap-12 xl:flex-row xl:gap-24">
          {/* Logo */}
          <div className="flex-shrink-0 xl:self-start">
            <Logo size="medium" />
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-8 md:gap-6 lg:flex-row lg:gap-6">
            <div className="flex flex-col items-center justify-center gap-12 sm:flex-row sm:items-start lg:gap-0">
              <FooterLinkList title="Product" links={productLinks} />
              <FooterLinkList title="Company" links={companyLinks} />
              <FooterLinkList title="Info" links={infoLinks} />
            </div>

            {/* Social Links */}
            <div className="lg: flex w-full justify-center pt-8 lg:inline-flex lg:w-44 lg:justify-start lg:pt-0">
              <div className="inline-flex w-44 flex-col items-center gap-5 lg:items-start">
                <div className="justify-center self-stretch text-center text-[10px] leading-none font-bold tracking-wider text-(--color-father) uppercase lg:justify-start lg:text-left">
                  Follow us
                </div>
                <div className="inline-flex items-center justify-center gap-5">
                  {socialIcons.map((icon, index) => (
                    <div
                      key={index}
                      className="relative h-6 w-6 cursor-pointer overflow-hidden transition-opacity hover:opacity-80"
                    >
                      <Image
                        src={icon.src}
                        alt={icon.alt}
                        width={24}
                        height={24}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 flex flex-col items-center gap-6 pt-6 lg:mt-16">
          <div className="h-0 w-full border-t border-neutral-300"></div>
          <div className="text-center text-base leading-loose font-normal text-gray-500">
            © 2021 Manual. All rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
}
