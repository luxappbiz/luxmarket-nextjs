
import CreateProduct from "@/components/create/Product";

export default async function CreatePage() {

  return (
    <>
      <div className="flex"> 
        <main className="flex-1 overflow-hidden">
          <section className="container mx-auto px-4 py-8">
            <CreateProduct />
          </section>
        </main>
      </div>
    </>
  );
}
