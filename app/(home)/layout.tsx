import FooterGallery from '@/components/Drawing/FooterGallery'
import SiteFrame from '@/components/SiteFrame'

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <SiteFrame className="rounded-b-3xl shadow-xl">{children}</SiteFrame>
      <FooterGallery />
    </>
  )
}
