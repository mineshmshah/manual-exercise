import Logo from "@/components/ui/Logo";
import Button from "../ui/Button";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="w-full overflow-hidden bg-(--color-grandfather-lightest) md:aspect-[1440/750] md:max-h-[750px] md:bg-[url('/images/hero-bg.png')] md:bg-cover md:bg-center md:bg-no-repeat">
      <div className="flex h-full w-full flex-col px-8 py-8 md:w-1/2 lg:px-30">
        {/* Logo at top */}
        <div>
          <Logo size="small" />
        </div>

        <div className="flex-grow" />

        {/* Content */}
        <div className="flex flex-col justify-center py-8 md:items-start md:py-0">
          <h1 className="self-center pb-5 text-center text-5xl text-(--color-father) md:self-start md:text-justify md:text-6xl 2xl:text-8xl">
            Be good <br className="hidden md:inline" /> to yourself
          </h1>
          <p className="text-md text-(--color-father) xl:text-lg">
            We’re working around the clock to bring you a holistic approach to
            your wellness. From top to bottom, inside and out.
          </p>
          <Button size="small" className="mt-9">
            TAKE THE QUIZ
          </Button>
        </div>
        <div className="flex-grow" />
      </div>

      {/* Image block for small screens only */}
      <div className="flex w-full justify-end md:hidden">
        <Image
          src="/images/hero-bg.png"
          alt="Hero background"
          width={400}
          height={300}
          className="h-auto min-h-[300px] object-cover object-right"
        />
      </div>
    </section>
  );
}
