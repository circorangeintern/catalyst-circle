import SideNav from "@/components/sideNav";
import UserNav from "@/components/userNav";
import LedgerLiteSettings from "@/components/settings";


export default function Settings() {
  return (
    <div>
      <div>
        <div>
          <SideNav />
        </div>
        <div className="ml-0 md:ml-60 sm:ml-0">
          <UserNav />
        </div>
        <main className="ml-0 md:ml-62 sm:ml-0  p-6">
          <div className="">
           <LedgerLiteSettings />
          </div>
        </main>
      </div>
    </div>
  );
}