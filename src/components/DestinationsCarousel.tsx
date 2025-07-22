import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import saharaDesert from "@/assets/sahara-desert.jpg";
import coastalBeach from "@/assets/coastal-beach.jpg";
import natureLandscape from "@/assets/nature-landscape.jpg";
import sidiBouSaid from "@/assets/sidi-bou-said.jpg";
import carthageRuins from "@/assets/carthage-ruins.jpg";
import djerbaIsland from "@/assets/djerba-island.jpg";

const destinations = [
  {
    id: 1,
    name: "Sidi Bou Said",
    description: "Picturesque blue and white village overlooking the Mediterranean",
    image: sidiBouSaid,
  },
  {
    id: 2,
    name: "Sahara Desert",
    description: "Endless golden dunes and unforgettable desert adventures",
    image: saharaDesert,
  },
  {
    id: 3,
    name: "Carthage Ruins",
    description: "Ancient Roman archaeological site with rich historical heritage",
    image: carthageRuins,
  },
  {
    id: 4,
    name: "Djerba Island",
    description: "Traditional crafts, beautiful beaches, and authentic culture",
    image: djerbaIsland,
  },
  {
    id: 5,
    name: "Mediterranean Coast",
    description: "Pristine beaches and crystal-clear turquoise waters",
    image: coastalBeach,
  },
  {
    id: 6,
    name: "Atlas Mountains",
    description: "Breathtaking mountain landscapes and scenic hiking trails",
    image: natureLandscape,
  },
];

export const DestinationsCarousel = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Discover Tunisia's Best Destinations
        </h2>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          From ancient ruins to pristine beaches, explore the diverse beauty that makes Tunisia unforgettable
        </p>
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="relative"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {destinations.map((destination) => (
            <CarouselItem key={destination.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
              <Card className="group overflow-hidden bg-black/20 border-white/20 backdrop-blur-sm hover:bg-black/30 transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-lg mb-2">
                      {destination.name}
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {destination.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-12 bg-white/10 border-white/20 text-white hover:bg-white/20" />
        <CarouselNext className="hidden md:flex -right-12 bg-white/10 border-white/20 text-white hover:bg-white/20" />
      </Carousel>
    </div>
  );
};