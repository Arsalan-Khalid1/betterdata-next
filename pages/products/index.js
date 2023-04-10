import Head from "next/head";
import styles from "../../styles/Home.module.css";
import "tailwindcss/tailwind.css";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import Header from "../../Components/Header";
import Product from "../../Components/Products";
import Footer from "../../Components/Footer";
import { ProductService } from "../../services/product.service";
import Spinner from "../../Components/Spinner";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const getProducts = async () => {
    try {
      setLoading(true);
      const response = await ProductService.index();
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert("error occurred");
    }
  };

  const getCategories = async () => {
    try {
      const response = await ProductService.getCategory();
      setCategories(response.data);
    } catch (error) {
      alert("error occurred");
    }
  };

  const handleChange = (e) => {
    const existing = filters.filter((f) => f === e.target.value);
    if (existing.length > 0) {
      const temp = filters.filter((f) => f !== e.target.value);
      handleFilteredItems(temp);
      setFilters(temp);
    } else {
      let temp = [...filters];
      temp.push(e.target.value);
      handleFilteredItems(temp);
      setFilters(temp);
    }
  };

  const handleFilteredItems = (options) => {
    if (options.length === 0) {
      setFilteredResults([]);
    } else {
      setFilteredResults(
        products.filter((p) => {
          const exists = options.filter((f) => f === p.category);
          if (exists.length > 0) {
            return true;
          } else {
            return false;
          }
        })
      );
    }
  };

  useEffect(() => {
    getProducts();
    getCategories();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Product Filter By Category</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="bg-white w-full">
        <div className="w-full">
          {/* Mobile filter dialog */}
          {products.length > 0 && (
            <>
              <Transition.Root show={mobileFiltersOpen} as={Fragment}>
                <Dialog
                  as="div"
                  className="relative z-40 lg:hidden"
                  onClose={setMobileFiltersOpen}
                >
                  <Transition.Child
                    as={Fragment}
                    enter="transition-opacity ease-linear duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-linear duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                  </Transition.Child>

                  <div className="fixed inset-0 z-40 flex">
                    <Transition.Child
                      as={Fragment}
                      enter="transition ease-in-out duration-300 transform"
                      enterFrom="translate-x-full"
                      enterTo="translate-x-0"
                      leave="transition ease-in-out duration-300 transform"
                      leaveFrom="translate-x-0"
                      leaveTo="translate-x-full"
                    >
                      <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                        <div className="flex items-center justify-between px-4">
                          <h2 className="text-lg font-medium text-gray-900">
                            Filters
                          </h2>
                          <button
                            type="button"
                            className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                            onClick={() => setMobileFiltersOpen(false)}
                          >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>

                        {/* Filters */}
                        <form className="mt-4 border-t border-gray-200">
                          <h3 className="sr-only">Categories</h3>
                          <Disclosure
                            as="div"
                            className="border-t border-gray-200 px-4 py-6"
                          >
                            {({ open }) => (
                              <>
                                <h3 className="-mx-2 -my-3 flow-root">
                                  <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                    <span className="font-medium text-gray-900">
                                      Categories
                                    </span>
                                    <span className="ml-6 flex items-center">
                                      {open ? (
                                        <MinusIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      ) : (
                                        <PlusIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      )}
                                    </span>
                                  </Disclosure.Button>
                                </h3>
                                <Disclosure.Panel className="pt-6">
                                  <div className="space-y-6">
                                    {categories.map((cat, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center"
                                      >
                                        <input
                                          id={`filter-${index}`}
                                          name={`${index}[]`}
                                          defaultValue={cat}
                                          type="checkbox"
                                          defaultChecked={false}
                                          onChange={handleChange}
                                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label
                                          htmlFor={`filter-mobile-${index}`}
                                          className="ml-3 min-w-0 flex-1 text-gray-500"
                                        >
                                          {cat}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </Disclosure.Panel>
                              </>
                            )}
                          </Disclosure>
                        </form>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </Dialog>
              </Transition.Root>
              <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-0 w-full">
                <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 w-full">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                    New Arrivals
                  </h1>

                  <div className="flex items-center">
                    <button
                      type="button"
                      className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                      onClick={() => setMobileFiltersOpen(true)}
                    >
                      <span className="sr-only">Filters</span>
                      <FunnelIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <section
                  aria-labelledby="products-heading"
                  className="pt-6 w-full"
                >
                  <h2 id="products-heading" className="sr-only">
                    Products
                  </h2>

                  <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                    {/* Filters */}
                    <form className="hidden lg:block">
                      <h3 className="sr-only">Categories</h3>
                      <Disclosure
                        as="div"
                        className="border-b border-gray-200 py-6"
                      >
                        {({ open }) => (
                          <>
                            <h3 className="-my-3 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                                <span className="font-medium text-gray-900">
                                  Categories
                                </span>
                                <span className="ml-6 flex items-center">
                                  {open ? (
                                    <MinusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <PlusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  )}
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              <div className="space-y-4">
                                {categories.map((cat, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center"
                                  >
                                    <input
                                      id={`filter-${index}`}
                                      name={`${index}[]`}
                                      defaultValue={cat}
                                      type="checkbox"
                                      defaultChecked={false}
                                      onChange={handleChange}
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label
                                      htmlFor={`filter-${index}`}
                                      className="ml-3 text-sm text-gray-600"
                                    >
                                      {cat}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    </form>

                    {/* Product grid */}
                    <div className="lg:col-span-3">
                      <Product
                        products={
                          filteredResults.length > 0
                            ? filteredResults
                            : products
                        }
                      />
                    </div>
                  </div>
                </section>
              </main>
            </>
          )}
          {loading && <Spinner />}
        </div>
      </div>

      <Footer />

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }
      `}</style>
    </div>
  );
}
