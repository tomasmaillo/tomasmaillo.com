import SiteFrame from '@/components/SiteFrame'

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <SiteFrame>{children}</SiteFrame>
}
