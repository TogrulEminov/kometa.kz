type Status = "PUBLISHED" | "published" | "DRAFT" | "archived";
export type CustomLocales = "az" | "en" | "ru";
export type AdditionArgument = {
  locale: string;
  page?: number;
  pageSize?: number;
  title?: string;
  url?: string;
  sort?: string;
  type?: string;
  externalId?: string;
};

export interface BaseItem {
  id: number;
  documentId: string;
  [key: string]: any;
}

export interface Column<T extends BaseItem> {
  title: string;
  dataIndex: keyof T;
  render?: (value: any, record: T) => React.ReactNode;
}

export type CountGenericType = {
  title: string;
  count: string;
};
export type InfoGenericType = {
  title: string;
  description?: string | undefined;
};

interface Seo {
  id: number;
  metaDescription: string;
  metaKeywords: string;
  metaTitle: string;
  locale: CustomLocales;
  image: string;
}

export interface PaginationItem {
  page: number;
  pageSize: number;
  dataCount: number;
  totalPages: number;
}

export interface Trash {
  id: number;
  title?: string;
  locale: string;
  documentId: string;
  updatedAt?: Date;
  model: string;
}

// content types
type EnumTranslation = {
  id: number;
  title: string;
  slug: string;
  locale: CustomLocales;
  description?: string;
  documentId: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface Enum {
  id: number;
  documentId: string;
  count?: number;
  createdAt: Date;
  updatedAt: Date;
  status: Status;
  translations: EnumTranslation[];
}

//file
export interface FileType {
  fullUrl?: string;
  type?: any;
  data?: any;
  fileId?: any | number | undefined;
  relativePath?: any | string | undefined;
  id?: number;
  fileKey?: string;
  originalName?: string;
  mimeType?: string;
  fileSize?: number;
  publicUrl?: string;
  createdAt: string;
  updatedAt: string;
}
export type DatabaseImageType = Pick<FileType, "id" | "fileKey" | "publicUrl">;
export type UploadedFileMeta = {
  fileId: number;
  fileKey: string;
  publicUrl: string;
  [key: string]: any;
} | null;

export interface CustomUploadFile {
  type: any;
  uid: string;
  name: string;
  status: "done" | "uploading" | "error" | "removed";
  url?: string;
  originFileObj?: File;
  fileId?: number;
  fileKey?: string;
}

interface CategoryTranslation {
  title: string;
  description: string;
  id: number;
  documentId: string;
  locale: string;
  seo: Seo;
}

export interface CategoryItem {
  id: number;
  documentId: string;
  slug: string;
  status: Status;
  imageUrl: FileType | null;
  createdAt: string;
  updatedAt: string;
  translations: CategoryTranslation[];
}

// blog
interface BlogTranslation {
  title: string;
  description: string;
  slug: string;
  id: number;
  documentId: string;
  locale: string;
  readTime: string;
  tags: string[];
  seo?: Seo | undefined;
}

export interface BlogItem {
  id: number;
  documentId: string;
  // status?: Status | undefined;
  view: number;
  imageUrl: FileType | null;
  createdAt: string;
  updatedAt: string;
  translations: BlogTranslation[];
}
// section
interface SectionContentTr {
  title: string;
  description: string;
  subTitle?: string;
  id: number;
  documentId: string;
  slug: string;
  locale: string;
}

export interface SectionContent {
  id: number;
  documentId: string;
  key: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
  translations: SectionContentTr[];
}

// fag
interface FagItemTr {
  title: string;
  description: string;
  id: number;
  documentId: string;
  slug: string;
  locale: string;
}

export interface FagItem {
  id: number;
  documentId: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
  translations: FagItemTr[];
}

// advantages

interface AdvantagesTr {
  title: string;
  description: string;
  id: number;
  slug: string;
  documentId: string;
  locale: string;
  seo: Seo;
}

export interface AdvantagesItem {
  id: number;
  documentId: string;
  status: Status;
  imageUrl: FileType | null;
  createdAt: string;
  updatedAt: string;
  translations: AdvantagesTr[];
}

// work process
interface WorkProcessTr {
  title: string;
  description: string;
  id: number;
  documentId: string;
  slug: string;
  locale: string;
}

export interface WorkProcessItem {
  id: number;
  documentId: string;
  status: Status;
  orderNumber: number;
  createdAt: string;
  updatedAt: string;
  translations: WorkProcessTr[];
}
// statistics
interface StatisticsTr {
  title: string;
  description: string;
  id: number;
  documentId: string;
  slug: string;
  locale: string;
}

export interface StatisticsItem {
  id: number;
  documentId: string;
  status: Status;
  orderNumber: number;
  count: number;
  createdAt: string;
  updatedAt: string;
  translations: StatisticsTr[];
}

//slider

interface SliderTranslation {
  title: string;
  description: string;
  id: number;
  documentId: string;
  slug: string;
  locale: string;
  seo: Seo;
}

export interface SliderItem {
  id: number;
  documentId: string;
  status: Status;
  imageUrl: FileType | null;
  createdAt: string;
  updatedAt: string;
  translations: SliderTranslation[];
}
// services
interface ServicesTranslation {
  title: string;
  description: string;
  slug: string;
  id: number;
  documentId: string;
  locale: string;
  shortDescription: string;
  seo: Seo;
  features: any[];
  fags: any[];
  advantages: any[];
}

export interface ServicesItem {
  id: number;
  documentId: string;
  status: Status;
  imageUrl: FileType | null;
  iconsUrl: FileType | null;
  orderNumber: number;
  createdAt: string;
  updatedAt: string;
  translations: ServicesTranslation[];
}
// connection
type ConnectionTranslation = {
  title: string;
  slug: string;
  id: number;
  description?: string | undefined;
  documentId: string;
  locale: string;
  shortDescription: string;
  createdAt: string;
  updatedAt: string;
};

export interface ConnectionItem {
  id: number;
  documentId: string;
  slug: string;
  // status: Status;
  orderNumber: number;
  imageUrl: FileType;
  url: string;
  createdAt: string;
  updatedAt: string;
  translations: ConnectionTranslation[];
}

type TestimonialsTr = {
  title: string;
  slug: string;
  id: number;
  description: string;
  documentId: string;
  locale: string;
  nameSurname: string;
  createdAt: string;
  updatedAt: string;
};

export interface TestimonialsItem {
  id: number;
  documentId: string;
  slug: string;
  rate: number;
  company: string;
  status: Status;
  imageUrl: FileType;
  createdAt: string;
  updatedAt: string;
  translations: TestimonialsTr[];
}

// youtube

interface YoutubeTranslations {
  id: number;
  title: string;
  description: string;
  slug: string;
  locale: string;
  documentId: string;
  createdAt: string;
  updatedAt: string;
}
export interface YoutubeItems {
  id: number;
  documentId: string;
  status: Status;
  url: string;
  imageUrl: FileType;
  duration: string;
  createdAt: string;
  updatedAt: string;
  translations: YoutubeTranslations[];
}

interface GalleryTr {
  id: number;
  title: string;
  slug: string;
  locale: string;
  documentId: string;
  createdAt: string;
  updatedAt: string;
}
export interface GalleryItem {
  id: number;
  documentId: string;
  status: Status;
  imageUrl: FileType;
  gallery: FileType[];
  createdAt: string;
  updatedAt: string;
  translations: GalleryTr[];
}
// certificates

interface CertificatesTr {
  title: string;
  description: string;
  id: number;
  documentId: string;
  locale: string;
  slug: string;
}

export interface Certificates {
  id: number;
  documentId: string;
  // status: Status;
  imageUrl: FileType | null;
  createdAt: string;
  updatedAt: string;
  translations: CertificatesTr[];
}

// employee

interface EmployeeTr {
  title: string;
  description: string;
  id: number;
  documentId: string;
  locale: string;
  position: EnumTranslation;
  positionId: number;
  slug: string;
}

export interface Employee {
  id: number;
  documentId: string;
  // status: Status;
  imageUrl: FileType | null;
  createdAt: string;
  orderNumber: number;
  emailResponse: boolean;
  email: string;
  experience: number;
  updatedAt: string;
  translations: EmployeeTr[];
}

// hero
export interface Hero {
  id: number;
  documentId: string;
  slug: string;
  isDeleted: boolean;
  status: Status;
  imageUrl: FileType;
  createdAt: string;
  updatedAt: string;
  translations: HeroTranslations[];
}

type HeroTranslations = {
  id: number;
  title: string;
  description: string;
  badge: string;
  subtitle: string;
  locale: CustomLocales;
  primaryButton: string;
  secondaryButton: string;
  highlightWord: string;
  features: InfoGenericType[];
  statistics: CountGenericType[];
  createdAt: string;
  updatedAt: string;
};

// features

export interface Features {
  id: number;
  documentId: string;
  slug: string;
  isDeleted: boolean;
  status: Status;
  videoUrl: FileType;
  createdAt: string;
  updatedAt: string;
  translations: FeaturesTranslations[];
}

type FeaturesTranslations = {
  id: number;
  title: string;
  description: string;
  subtitle: string;
  locale: CustomLocales;
  createdAt: string;
  updatedAt: string;
};

// about
export interface About {
  id: number;
  documentId: string;
  slug: string;
  isDeleted: boolean;
  status: Status;
  imageUrl: FileType;
  createdAt: string;
  experience: number;
  customers: number;
  updatedAt: string;
  translations: AboutTranslations[];
}

type AboutTranslations = {
  id: number;
  title: string;
  description: string;
  badge: string;
  subtitle: string;
  locale: CustomLocales;
  primaryButton: string;
  secondaryButton: string;
  advantages: InfoGenericType[];
  features: InfoGenericType[];
  statistics: CountGenericType[];
  createdAt: string;
  updatedAt: string;
};

export type BranchesStatus = "ACTIVE" | "PLANNED";
export type TypeStatus = "office" | "warehouse";
interface BranchTranslation {
  countryName: string;
  locale: CustomLocales;
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
}
// branch
export interface BranchItem {
  id: number;
  documentId: string;
  status: BranchesStatus;
  isoCode: string;
  isDeleted: boolean;
  countryName: string;
  createdAt: string;
  updatedAt: string;
  translations: BranchTranslation[];
  offices: Office[];
}
// office
type OfficeTranslation = {
  address: string;
  locale: CustomLocales;
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  city: string;
};
export interface Office {
  id: number;
  documentId: string;
  latitude: Float32Array;
  longitude: Float32Array;
  type: TypeStatus;
  isDeleted: boolean;
  branchId: string;
  createdAt: string;
  updatedAt: string;
  translations: OfficeTranslation[];
}

// contact
export interface ContactInfo {
  id: number;
  documentId: string;
  isDeleted: boolean;
  phone: string;
  phoneSecond?: string;
  latitude: string;
  longitude: string;
  adressLink: string;
  whatsapp: string;
  email: string;
  translations: ContactInfoTranslations[];
}

type ContactInfoTranslations = {
  id: number;
  adress: string;
  workHours: string;
  tag: string;
  support: string;
  createdAt: string;
  title: string;
  description: string;
  updatedAt: string;
};
export interface Social {
  id: number;
  documentId: string;
  socialName: string;
  socialLink: string;
  iconName: string;
  status: "published" | "draft";
  createdAt: Date;
  updatedAt: Date;
}
