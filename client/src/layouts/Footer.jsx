import { Link } from "react-router-dom";
import { Logo } from "@components";
import { Mail, Phone, ChevronRight } from "lucide-react";
import { useGetCategoriesQuery } from "@store/api/apiSlice";

const Footer = () => {
  const { data: allCategories = [] } = useGetCategoriesQuery();
  const displayedCategories = allCategories.slice(0, 12);
  const footerLinkClass =
    "text-slate-400 hover:text-orange-500 transition-all duration-200 text-sm flex items-center group whitespace-nowrap";

  return (
    <footer className='bg-slate-950 text-white'>
      <div className='max-w-7xl mx-auto px-6 pt-16 pb-6'>
        {/* Main Flex Container */}
        <div className='flex flex-col lg:flex-row justify-between items-start gap-12 mb-12'>
          {/* Logo & Brand */}
          <div className='flex flex-col space-y-6 max-w-[260px]'>
            <Link to='/' className='inline-block'>
              <Logo />
            </Link>
            <p className='text-sm text-slate-400'>
              Your premier destination for high-end technology and digital
              lifestyle products.
            </p>
          </div>

          {/* Categories */}
          <div className='flex-1 flex justify-center'>
            <div className='min-w-fit'>
              <h4 className='font-bold text-xs uppercase tracking-[0.2em] mb-6 text-orange-500 lg:text-center'>
                Categories
              </h4>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-3'>
                {displayedCategories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/category/${cat._id}`}
                    className={footerLinkClass}
                  >
                    <ChevronRight
                      size={14}
                      className='mr-1 text-orange-500/50 group-hover:text-orange-500 transition-colors'
                    />
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className='flex flex-col min-w-fit'>
            <h4 className='font-bold text-xs uppercase tracking-[0.2em] mb-6 text-orange-500'>
              Contact
            </h4>
            <div className='space-y-4 flex flex-col'>
              <a href='mailto:info@techshop.com' className={footerLinkClass}>
                <Mail
                  size={18}
                  className='order-first lg:order-last text-orange-500 shrink-0 mr-3 lg:mr-0 lg:ml-3'
                />
                <span>info@techshop.com</span>
              </a>
              <a href='tel:+15551234567' className={footerLinkClass}>
                <Phone
                  size={18}
                  className='order-first lg:order-last text-orange-500 shrink-0 mr-3 lg:mr-0 lg:ml-3'
                />
                <span>+1 (555) 123-4567</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className='pt-8 border-t border-white/5 text-[13px] text-slate-500'>
          <p>
            &copy; {new Date().getFullYear()} TechShop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
