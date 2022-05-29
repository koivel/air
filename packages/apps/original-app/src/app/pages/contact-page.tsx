export const ContactPage = () => {
  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-slate-200 p-8 rounded-md">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="/assets/logo.svg"
            alt="Koivel"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Contact Us
          </h2>
          <div className="pt-3">
            <h3>
              <a href="https://discord.gg/SgcfNBJGpM">
                Discord: https://discord.gg/SgcfNBJGpM
              </a>
            </h3>
            <h3>
              <a href="devteam.koivel@gmail.com">
                Email: devteam.koivel@gmail.com
              </a>
            </h3>
            <h3>
              <a href="https://www.linkedin.com/in/zach-herridge/">
                LinkedIn: https://www.linkedin.com/in/zach-herridge/
              </a>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
