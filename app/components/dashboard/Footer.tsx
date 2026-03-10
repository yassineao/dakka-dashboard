export default function Footer() {
  return (
    <>
      <footer className="mx-4  rounded-lg bg-white p  md:flex md:items-center md:justify-between md:p-6 xl:p-8">
        <ul className=" flex flex-wrap items-center md:mb-0">
          {["Terms", "Privacy", "Contact"].map((item) => (
            <li key={item}>
              <a
                href="#"
                className=" text-sm font-normal text-gray-500 hover:underline md:mr-6"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        <p className="text-sm text-gray-500">Appointments Dashboard</p>
         <p className="my-10 text-center text-sm text-gray-500">
        &copy; 2026 Appointments Dashboard. All rights reserved.
      </p>
      </footer>

     
    </>
  );
}