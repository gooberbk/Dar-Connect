import Image from 'next/image';
import { Link } from '../navigation';
import { MapPin, Bed, Bath, Square, ArrowRight } from 'lucide-react';

interface PropertyProps {
  id: string;
  title: string;
  price: number;
  location: string;
  imageUrl: string;
  beds?: number;
  baths?: number;
  sqft?: number;
}

export default function PropertyCard({
  id,
  title,
  price,
  location,
  imageUrl,
  beds = 3,
  baths = 2,
  sqft = 120,
}: PropertyProps) {
  return (
    <Link href={`/properties/${id}`} className="group block h-full">
      <div className="card card-hover h-full flex flex-col overflow-hidden rounded-2xl">
        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Price badge */}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-blue-700 font-bold text-sm px-3 py-1.5 rounded-xl shadow-md">
            {price.toLocaleString()} DZD
            <span className="text-gray-400 font-normal text-xs"> /nuit</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-semibold text-lg text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {title}
          </h3>

          <div className="flex items-center text-gray-400 mt-1.5 mb-4">
            <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0 text-blue-400" />
            <span className="text-sm truncate">{location}</span>
          </div>

          {/* Divider + specs */}
          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4 text-gray-400" />
                <span>{beds}</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4 text-gray-400" />
                <span>{baths}</span>
              </div>
              <div className="flex items-center gap-1">
                <Square className="w-4 h-4 text-gray-400" />
                <span>{sqft} m²</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Voir <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
