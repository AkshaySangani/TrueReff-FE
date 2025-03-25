import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Facebook,
  Instagram,
  Youtube,
  Link as LinkIcon,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function InfluencerProfile() {
  return (
    <Card className="bg-white rounded-[20PX] overflow-hidden border-0 shadow-none">
      <div className="relative h-40 md:h-48 w-full bg-blue-100 rounded-b-[20px]">
        <img
          src="/assets/creator/profile/profile-bg.png"
          alt="Background"
          className="w-full h-full object-cover rounded-b-[20px]"
        />
      </div>
      <div className="flex items-end px-6 -mt-14 w-full justify-between">
        <div className="w-[120px] h-[120px] md:w-[120px] md:h-[120px]">
          <Avatar className="w-[120px] h-[120px] md:w-[120px] md:h-[120px] border-1 border-white bg-white">
            <AvatarImage
              src="/assets/creator/profile/profile.png"
              alt="Jhon Deo"
              width={120}
              height={120}
            />
            w<AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex gap-2 md:gap-4 text-gray-500 text-lg md:text-2xl">
          <Link
            href="#"
            target="_blank"
            className="w-[35px] h-[35px] rounded-full bg-background flex items-center justify-center p-1.5"
          >
            <Image
              src="/assets/creator/profile/fbIcon.svg"
              alt="Jhon Deo"
              width={35}
              height={35}
            />
          </Link>
          <Link
            href="#"
            target="_blank"
            className="w-[35px] h-[35px] rounded-full bg-background flex items-center justify-center p-1.5"
          >
            <Image
              src="/assets/creator/profile/twitterIcon.svg"
              alt="Jhon Deo"
              width={35}
              height={35}
            />
          </Link>
          <Link
            href="#"
            target="_blank"
            className="w-[35px] h-[35px] rounded-full bg-background flex items-center justify-center p-1.5"
          >
            <Image
              src="/assets/creator/profile/instaIcon.svg"
              alt="Jhon Deo"
              width={35}
              height={35}
            />
          </Link>
          <Link
            href="#"
            target="_blank"
            className="w-[35px] h-[35px] rounded-full bg-background flex items-center justify-center p-1.5"
          >
            <Image
              src="/assets/creator/profile/ytIcon.svg"
              alt="Jhon Deo"
              width={35}
              height={35}
            />
          </Link>
        </div>
      </div>
      <CardContent className="pt-2 md:pt-2 pb-4 md:pb-6 px-4 md:px-6 flex flex-col gap-3 md:gap-4">
        <div className="flex flex-wrap items-center gap-1 md:gap-2">
          <h2 className="text-lg md:text-xl font-medium text-gray-black">
            Jhon Deo
          </h2>
          <span className="text-lg md:text-xl font-medium text-gray-black">
            (@john_doe_90)
          </span>
          <LinkIcon className="text-primary cursor-pointer w-4 h-4 md:w-5 md:h-5" />
        </div>
        <p className="text-sm md:text-base text-font-grey">
          Helping men stay stylish with the latest fashion trends.
        </p>
        <div className="flex gap-2 md:gap-4 flex-wrap">
          {["#Fashion", "#MenGrooming", "#StyleTips", "#LuxuryWear"].map(
            (tag) => (
              <span
                key={tag}
                className="bg-gray-small-light text-sm md:text-sm px-3 py-3 text-gray-black rounded-md"
              >
                {tag}
              </span>
            )
          )}
        </div>
        <p className="text-sm md:text-base text-font-grey">
          I'm John, a fashion influencer sharing style tips, outfit inspiration,
          and grooming advice for men.
        </p>
        <div className="flex gap-2 md:gap-4">
          <Button
            size={"lg"}
            className="bg-primary-color hover:bg-pink-600 text-white px-4 md:px-5 py-1 md:py-3 rounded-md text-xs md:text-sm"
          >
            Fashion & Beauty
          </Button>
          <Button
            size={"lg"}
            className="bg-primary-color hover:bg-pink-600 text-white px-4 md:px-5 py-1 md:py-3 rounded-md text-xs md:text-sm"
          >
            Men's Fashion
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
